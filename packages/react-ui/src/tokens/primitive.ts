/**
 * Layer 1 — primitive tokens: raw values, no meaning attached yet. Nothing
 * in this file should ever be referenced directly by a component — only
 * `semantic.ts` (and, for multi-variant components, `component.ts`) may
 * reference these.
 *
 * Colors are OKLCH (`oklch(lightness chroma hue)`) rather than hex — a
 * perceptually-uniform space where "bump the lightness by 10%" behaves the
 * way it visually reads, unlike sRGB hex where the same delta looks very
 * different depending on the starting hue. This also matches the DaisyUI
 * theme-file convention this token set was ported from (see the "Custom
 * theming" section of `../../README.md` for the source file and the design
 * decision to adopt it as nebula's base theme rather than keep the old
 * hex/Tailwind-gray palette).
 *
 * Unlike the old palette, most of these roles don't have a numeric 50-950
 * scale — DaisyUI's theme format assigns exactly one shade per role instead,
 * so "raw value" here mostly just means "not yet assigned to light or dark."
 * Roles that read identically in both themes (`primary`, `secondary`,
 * `accent`, `info`, `warning`, `infoContent`, `warningContent`) are plain
 * strings; roles that differ get a `{ light, dark }` pair, composed by
 * `semantic.ts`.
 */
const color = {
  base: {
    light100: 'oklch(98% 0 0)',
    light200: 'oklch(96% 0.001 286.375)',
    light300: 'oklch(92% 0.004 286.32)',
    lightContent: 'oklch(21% 0.006 285.885)',
    dark100: 'oklch(27% 0.041 260.031)',
    dark200: 'oklch(20% 0.042 265.755)',
    dark300: 'oklch(12% 0.042 264.695)',
    darkContent: 'oklch(97.807% 0.029 256.847)',
  },
  primary: 'oklch(76% 0.188 70.08)',
  // Overridden from the source theme file's `oklch(98% 0.014 180.72)`/
  // `oklch(96% 0.018 272.314)` (both near-white) — those failed WCAG 1.4.3
  // against `primary` at 2.10:1/1.97:1 (needs 4.5:1; see CONTRAST_AUDIT.md).
  // `primary`'s 76% lightness just isn't dark enough to support light text,
  // so this follows the same pattern already used elsewhere in this same
  // theme for `success`/`warning`/`error` `-Content` pairs: a low-lightness,
  // low-chroma shade *of the fill's own hue* rather than a generic
  // near-black, so filled buttons/badges still read as "on-brand" rather
  // than tinted gray. One shared value (not a `{ light, dark }` pair) since
  // `primary` itself is identical in both themes. 7.86:1 against `primary`.
  primaryContent: 'oklch(22% 0.05 70.08)',
  secondary: 'oklch(28% 0.091 267.935)',
  secondaryContent: {
    light: 'oklch(98% 0.002 247.839)',
    dark: 'oklch(93% 0.032 255.585)',
  },
  accent: 'oklch(65% 0.241 354.308)',
  // Same fix and reasoning as `primaryContent` above — the source theme's
  // `oklch(97%.../94%...)` near-white pair failed at 3.35:1/3.05:1 against
  // `accent`. 5.00:1 against `accent`.
  accentContent: 'oklch(20% 0.05 354.308)',
  neutral: {
    light: 'oklch(44% 0.043 257.281)',
    lightContent: 'oklch(98% 0 0)',
    dark: 'oklch(96% 0.003 264.542)',
    darkContent: 'oklch(27% 0.033 256.848)',
  },
  info: 'oklch(74% 0.16 232.661)',
  infoContent: 'oklch(29% 0.066 243.157)',
  success: {
    light: 'oklch(79% 0.209 151.711)',
    lightContent: 'oklch(26% 0.065 152.934)',
    dark: 'oklch(76% 0.177 163.223)',
    darkContent: 'oklch(37% 0.077 168.94)',
  },
  warning: 'oklch(85% 0.199 91.936)',
  warningContent: {
    light: 'oklch(28% 0.066 53.813)',
    dark: 'oklch(42% 0.095 57.708)',
  },
  error: {
    light: 'oklch(70% 0.191 22.216)',
    lightContent: 'oklch(25% 0.092 26.042)',
    dark: 'oklch(71% 0.194 13.428)',
    darkContent: 'oklch(27% 0.105 12.094)',
  },
} as const;

/**
 * Per-component corner radius — a fixed value per component *role* rather
 * than a numeric scale (DaisyUI's convention), so a consumer can dial in
 * "pill-shaped buttons but square cards" by overriding one custom property
 * without touching any others. All default to the same value here (a fully
 * rounded/pill look); see `component.ts` for how these become CSS vars.
 */
const radius = {
  selector: '2rem',
  field: '2rem',
  box: '2rem',
  button: '2rem',
  card: '2rem',
  dialog: '2rem',
  badge: '2rem',
  chip: '2rem',
  avatar: '2rem',
  menu: '2rem',
  popover: '2rem',
  tooltip: '2rem',
  progress: '2rem',
} as const;

/**
 * Base sizing unit per component *role* — components compute their own
 * padding/height as a multiple of this (e.g. a field's height might be
 * `calc(var(--size-field) * 10)`), rather than each hardcoding an absolute
 * height. Not yet consumed by any component in this package (`Button` still
 * hardcodes `h-8`/`h-10`/`h-12`) — wiring components up to read these is
 * follow-up work, tracked in `AGENTS.md`.
 */
const size = {
  selector: '0.25rem',
  field: '0.25rem',
  button: '0.25rem',
  icon: '0.25rem',
  badge: '0.25rem',
  chip: '0.25rem',
} as const;

/** Border width, and two DaisyUI "effect" knobs (`depth` for pseudo-3D shading, `noise` for a subtle texture overlay) — 0/1 rather than boolean so they can be dialed in CSS (`calc()`, `opacity`) rather than only switched on/off. Not yet consumed by any component. */
const effect = {
  border: '1px',
  depth: '0',
  noise: '0',
} as const;

const fontStack = {
  sans: "system-ui, 'Segoe UI', Roboto, sans-serif",
  heading: "system-ui, 'Segoe UI', Roboto, sans-serif",
  mono: 'ui-monospace, Consolas, monospace',
} as const;

/**
 * The full primitive token tree — raw values only, grouped by category.
 *
 * @example
 * ```ts
 * import { primitiveTokens } from '@nebula/react-ui/tokens';
 *
 * // Only for use inside semantic.ts / component.ts — never import this
 * // directly into a component or story.
 * const brandPrimary = primitiveTokens.color.primary;
 * ```
 */
const primitiveTokens = { color, radius, size, effect, fontStack } as const;

export { primitiveTokens };
