/**
 * Computes WCAG 2.x contrast ratios for every meaningful foreground/background
 * pairing in `semantic.ts` and `component.ts`, for both themes, and prints a
 * pass/fail report against the relevant success criterion:
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
 * actually get introduced (someone tweaks a hex in `primitive.ts` without
 * rechecking every semantic pairing that inherits it).
 */
import { semanticTokens } from './semantic';

type Level = 'text' | 'ui';

interface Pairing {
  label: string;
  fg: string;
  bg: string;
  level: Level;
}

/** Parses a `#rgb`/`#rrggbb` hex color into 0-255 RGB channels. */
function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;
  const int = Number.parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** WCAG relative luminance for one sRGB channel (0-255). */
function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance (0-1) of a hex color. */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** WCAG contrast ratio (1-21) between two hex colors. */
function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * `light` and `dark` are each `as const`, so their hex values are distinct
 * string-literal types — typing this param as `typeof semanticTokens.light`
 * would reject `semanticTokens.dark` outright. This union of both themes'
 * exact (still-literal) shapes accepts either.
 */
type SemanticTheme = (typeof semanticTokens)[keyof typeof semanticTokens];

function buildPairings(theme: SemanticTheme, themeName: string): Pairing[] {
  const { bg, text, border, status } = theme.color;
  return [
    { label: `[${themeName}] text.default on bg.default`, fg: text.default, bg: bg.default, level: 'text' },
    { label: `[${themeName}] text.default on bg.subtle`, fg: text.default, bg: bg.subtle, level: 'text' },
    { label: `[${themeName}] text.muted on bg.default`, fg: text.muted, bg: bg.default, level: 'text' },
    { label: `[${themeName}] text.muted on bg.subtle`, fg: text.muted, bg: bg.subtle, level: 'text' },
    {
      label: `[${themeName}] text.onInteractive on bg.interactive`,
      fg: text.onInteractive,
      bg: bg.interactive,
      level: 'text',
    },
    {
      label: `[${themeName}] text.onInteractive on bg.interactiveHover`,
      fg: text.onInteractive,
      bg: bg.interactiveHover,
      level: 'text',
    },
    {
      label: `[${themeName}] text.onInteractive on status.danger (filled danger button)`,
      fg: text.onInteractive,
      bg: status.danger,
      level: 'text',
    },
    {
      label: `[${themeName}] status.danger on bg.default (inline error text)`,
      fg: status.danger,
      bg: bg.default,
      level: 'text',
    },
    {
      label: `[${themeName}] status.success on bg.default (inline success text)`,
      fg: status.success,
      bg: bg.default,
      level: 'text',
    },
    {
      label: `[${themeName}] status.warning on bg.default (inline warning text)`,
      fg: status.warning,
      bg: bg.default,
      level: 'text',
    },
    { label: `[${themeName}] border.default on bg.default`, fg: border.default, bg: bg.default, level: 'ui' },
    {
      label: `[${themeName}] border.interactive on bg.default`,
      fg: border.interactive,
      bg: bg.default,
      level: 'ui',
    },
    { label: `[${themeName}] border.focus on bg.default (focus ring)`, fg: border.focus, bg: bg.default, level: 'ui' },
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

export { contrastRatio, relativeLuminance, buildPairings };
