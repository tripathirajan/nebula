/**
 * Computes WCAG 2.x contrast ratios for every meaningful foreground/background
 * pairing in `semantic.ts`, for both themes, and prints a pass/fail report
 * against the relevant success criterion:
 *
 * - 1.4.3 Contrast (Minimum) — normal text needs >= 4.5:1.
 * - 1.4.11 Non-text Contrast — UI component boundaries (borders, focus
 *   indicators) need >= 3:1 against their background.
 *
 * Run with: `pnpm --filter @nebula/react-ui contrast-audit`
 * (or `npx tsx packages/react-ui/src/tokens/contrast-audit.ts` from the repo root).
 *
 * This does not replace visual/automated review of real rendered UI — it
 * only checks the token *values*, which is where most contrast regressions
 * actually get introduced (someone tweaks a value in `primitive.ts` without
 * rechecking every semantic pairing that inherits it).
 *
 * Colors here are `oklch()` strings (see `primitive.ts` for why), so the
 * luminance math goes straight from OKLCH to linear-light sRGB via Björn
 * Ottosson's published OKLab conversion matrices
 * (https://bottosson.github.io/posts/oklab/#converting-from-linear-srgb-to-oklab)
 * rather than the old hex -> gamma-corrected-sRGB -> linear pipeline — WCAG's
 * relative luminance formula wants linear-light RGB either way, and the
 * OKLab matrices land there directly, so there's no need to round-trip
 * through gamma-corrected sRGB/hex at all.
 */
import { semanticTokens } from './semantic';

type Level = 'text' | 'ui';

interface Pairing {
  label: string;
  fg: string;
  bg: string;
  level: Level;
}

interface Oklch {
  l: number;
  c: number;
  h: number;
}

/** Parses an `oklch(L% C H)` string (as produced by `primitive.ts`) into its components. */
function parseOklch(value: string): Oklch {
  const match = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(value);
  if (!match) {
    throw new Error(`contrast-audit: not a parseable oklch() value: "${value}"`);
  }
  const [, lightness, chroma, hue] = match as unknown as [string, string, string, string];
  return { l: Number(lightness) / 100, c: Number(chroma), h: Number(hue) };
}

/** Clamps to `[0, 1]` — out-of-gamut OKLCH colors can convert to slightly negative or >1 linear-sRGB channels; these tokens are all valid in-gamut colors in practice, but clamp defensively rather than let a rounding artifact skew a ratio. */
function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Converts OKLCH to linear-light sRGB via OKLab (0-1 per channel, before
 * clamping). Matrix constants are Björn Ottosson's reference values for
 * OKLab <-> LMS <-> linear sRGB.
 */
function oklchToLinearSrgb({ l, c, h }: Oklch): [number, number, number] {
  const hueRadians = (h * Math.PI) / 180;
  const a = c * Math.cos(hueRadians);
  const b = c * Math.sin(hueRadians);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  return [r, g, bLin];
}

/** WCAG relative luminance (0-1) of an `oklch()` color string. */
function relativeLuminance(oklch: string): number {
  const [r, g, b] = oklchToLinearSrgb(parseOklch(oklch));
  return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
}

/** WCAG contrast ratio (1-21) between two `oklch()` color strings. */
function contrastRatio(oklchA: string, oklchB: string): number {
  const lumA = relativeLuminance(oklchA);
  const lumB = relativeLuminance(oklchB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * `light` and `dark` are each `as const`, so their oklch-string values are
 * distinct string-literal types — typing this param as
 * `typeof semanticTokens.light` would reject `semanticTokens.dark` outright.
 * This union of both themes' exact (still-literal) shapes accepts either.
 */
type SemanticTheme = (typeof semanticTokens)[keyof typeof semanticTokens];

function buildPairings(theme: SemanticTheme, themeName: string): Pairing[] {
  const {
    base,
    primary,
    primaryContent,
    secondary,
    secondaryContent,
    accent,
    accentContent,
    neutral,
    neutralContent,
    info,
    infoContent,
    success,
    successContent,
    successText,
    warning,
    warningContent,
    error,
    errorContent,
    errorText,
  } = theme.color;

  return [
    { label: `[${themeName}] base.content on base.100 (body text)`, fg: base.content, bg: base[100], level: 'text' },
    { label: `[${themeName}] base.content on base.200`, fg: base.content, bg: base[200], level: 'text' },
    {
      label: `[${themeName}] primaryContent on primary (filled primary button)`,
      fg: primaryContent,
      bg: primary,
      level: 'text',
    },
    {
      label: `[${themeName}] secondaryContent on secondary (filled secondary button)`,
      fg: secondaryContent,
      bg: secondary,
      level: 'text',
    },
    { label: `[${themeName}] accentContent on accent`, fg: accentContent, bg: accent, level: 'text' },
    { label: `[${themeName}] neutralContent on neutral`, fg: neutralContent, bg: neutral, level: 'text' },
    { label: `[${themeName}] infoContent on info`, fg: infoContent, bg: info, level: 'text' },
    { label: `[${themeName}] successContent on success`, fg: successContent, bg: success, level: 'text' },
    { label: `[${themeName}] warningContent on warning`, fg: warningContent, bg: warning, level: 'text' },
    {
      label: `[${themeName}] errorContent on error (filled danger button)`,
      fg: errorContent,
      bg: error,
      level: 'text',
    },
    { label: `[${themeName}] error on base.100 (inline error text)`, fg: error, bg: base[100], level: 'text' },
    { label: `[${themeName}] success on base.100 (inline success text)`, fg: success, bg: base[100], level: 'text' },
    { label: `[${themeName}] warning on base.100 (inline warning text)`, fg: warning, bg: base[100], level: 'text' },
    {
      label: `[${themeName}] successText on base.100 (trend/status text, e.g. DashboardOverview's trend arrow)`,
      fg: successText,
      bg: base[100],
      level: 'text',
    },
    {
      label: `[${themeName}] errorText on base.100 (trend/status text, e.g. DashboardOverview's trend arrow)`,
      fg: errorText,
      bg: base[100],
      level: 'text',
    },
    {
      label: `[${themeName}] base.300 on base.100 (default divider/border)`,
      fg: base[300],
      bg: base[100],
      level: 'ui',
    },
    // No `primary`-on-`base.100` pairing here (there was one) — `Button`
    // used to ring itself in `primary`, which only clears ~2:1 against
    // `base.100` in light mode (well under the 3:1 non-text minimum); it now
    // rings in `base.content` instead (see `button.tsx`), which is exactly
    // the already-covered "body text" pairing above, so a separate entry
    // would be redundant. `primary` itself is unaffected — it's still fine
    // as a *fill* (see `primaryContent on primary` above), just not as a
    // thin outline on `base.100`.
  ];
}

const THRESHOLDS: Record<Level, number> = { text: 4.5, ui: 3 };

const pairings = [
  ...buildPairings(semanticTokens.light, 'light'),
  ...buildPairings(semanticTokens.dark, 'dark'),
];

let failures = 0;
const rows = pairings.map(({ label, fg, bg, level }) => {
  const ratio = contrastRatio(fg, bg);
  const threshold = THRESHOLDS[level];
  const pass = ratio >= threshold;
  if (!pass) failures += 1;
  return { label, ratio: ratio.toFixed(2), threshold, pass };
});


console.log('WCAG contrast audit\n');
for (const row of rows) {
  const status = row.pass ? 'PASS' : 'FAIL';

  console.log(`[${status}] ${row.label} — ${row.ratio}:1 (needs >= ${row.threshold}:1)`);
}

console.log(`\n${rows.length - failures}/${rows.length} pairings pass.`);

if (failures > 0) {
  process.exitCode = 1;
}

export { contrastRatio, relativeLuminance, buildPairings, parseOklch, oklchToLinearSrgb };
