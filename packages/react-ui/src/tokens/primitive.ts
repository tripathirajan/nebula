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
    light100: 'oklch(100% 0 29.234)',
    light200: 'oklch(98% 0.003 247.858)',
    light300: 'oklch(92% 0.004 286.32)',
    lightContent: 'oklch(21% 0.006 285.885)',
    dark100: 'oklch(27% 0.041 260.031)',
    dark200: 'oklch(20% 0.042 265.755)',
    dark300: 'oklch(12% 0.042 264.695)',
    darkContent: 'oklch(97.807% 0.029 256.847)',
  },
  primary: {
    light: 'oklch(28% 0.091 267.935)',
    dark: 'oklch(62% 0.214 259.815)',
  },
  // `light` keeps the source theme's near-white value — `primary.light`'s
  // 28% lightness is dark enough to support it (14.06:1). `dark` can't
  // reuse it: `primary.dark` is a much brighter 62%-lightness blue, so
  // near-white text on it only clears ~3.6:1 (fails WCAG 1.4.3's 4.5:1; see
  // `CONTRAST_AUDIT.md`, re-run after `primary` was split into a `{ light,
  // dark }` pair). Fixed the same way this theme's `success`/`warning`/
  // `error` `-Content` pairs and `accentContent` below are: a low-lightness,
  // low-chroma shade *of the fill's own hue* rather than a generic
  // near-black, so filled buttons/badges still read as "on-brand" rather
  // than tinted gray. 5.12:1 against `primary.dark`.
  primaryContent: {
    light: 'oklch(98% 0.014 180.72)',
    dark: 'oklch(16% 0.05 259.815)',
  },
  secondary: 'oklch(66% 0.179 58.318)',
  // Was a near-white `{ light, dark }` pair (`oklch(98%.../93%...)`) —
  // both failed WCAG 1.4.3 against `secondary` (3.09:1/2.66:1; see
  // `CONTRAST_AUDIT.md`, re-run after `secondary`'s value changed and this
  // pairing was never rechecked). `secondary` itself is one shared value in
  // both themes, so — same fix pattern as `accentContent` — this collapses
  // to a single low-lightness, low-chroma shade of `secondary`'s own hue.
  // 5.35:1 against `secondary`.
  secondaryContent: 'oklch(22% 0.05 58.318)',
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
  // For `success`/`error` used as *inline text on `base.100`* (a trend
  // arrow's "+2.6%", not a filled badge) — a distinct pairing from
  // `-Content` above (that's for text *on the fill*). `success`/`error`
  // themselves fail WCAG 1.4.3 as light-mode text (`CONTRAST_AUDIT.md`
  // documented this as a known, deliberately-unfixed gap until something
  // actually needed it — `DashboardOverview`'s `trend` prop now does).
  // `dark` mode already passes using the existing fill color directly (a
  // bright, saturated hue reads fine against dark-mode's near-black
  // `base.100`), so only `light` needed a real new value: a dark,
  // low-chroma shade of the same hue, same pattern as `primaryContent`/
  // `secondaryContent`/`accentContent`. 13.21:1 / 14.22:1 against
  // `base.light100`.
  successText: {
    light: 'oklch(30% 0.065 151.711)',
    dark: 'oklch(76% 0.177 163.223)',
  },
  errorText: {
    light: 'oklch(30% 0.092 22.216)',
    dark: 'oklch(71% 0.194 13.428)',
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
  field: '1rem',
  box: '2rem',
  button: '2rem',
  card: '2rem',
  dialog: '2rem',
  badge: '2rem',
  chip: '2rem',
  avatar: '2rem',
  menu: '2rem',
  // Deliberately smaller than every other role here: `--radius-popover`
  // backs every floating list/panel surface (`Popover`, `Menu` and its
  // `ContextMenu`/`Menubar`/`DropdownMenu` variants, `Combobox`, `Select`,
  // `MultiSelect`, `HoverCard` — see each `*-content.tsx`'s
  // `rounded-[var(--radius-popover)]`), all of which pad their content by
  // only `p-1`. At the same pill radius as `button`/`card`/etc. (`2rem`),
  // that corner curve is far bigger than the padding meant to keep content
  // clear of it, so items nearest a corner visually clip into the rounded
  // edge instead of sitting inside a clean rectangle — the "weird padding"
  // a menu/popover reads at a glance. A modest radius keeps the same
  // rounded-corner language without outgrowing a compact panel's padding.
  popover: '0.75rem',
  tooltip: '2rem',
  progress: '2rem',
  // Deliberately its own role rather than reusing `box` (both were `2rem`
  // until this was split out): an `Alert` is a static, always-visible
  // status message sitting inline in a page's content flow, not a
  // floating/pill-shaped surface — a full `2rem` pill radius reads as
  // over-rounded for a rectangular block of body text next to other
  // square-ish content. `1rem` keeps the softened-corner language every
  // other surface in this theme uses without the pill look.
  alert: '1rem',
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
  // `Card`'s own padding scale (`CardHeader`/`CardContent`/`CardFooter` all
  // read `calc(var(--size-card) * 3)`) — the first real consumer of this
  // group's documented pattern. Previously hand-patched directly into
  // `theme.css` as an orphaned `--card-spacing` var with no primitive
  // behind it, which silently disappeared the next time `generate.ts` ran
  // (a generated file, not meant to carry hand edits) — moved here so it
  // regenerates correctly going forward.
  card: '0.5rem',
} as const;

/**
 * Icon-size convention (documented, not tokenized as a new CSS var group).
 * `size.icon` above is a DaisyUI-style *multiplier* primitive, unrelated to
 * this — no component reads it for an icon's actual width/height. An icon's
 * real dimensions come straight from Tailwind's own `h-*`/`w-*` spacing
 * scale, which is already a systematic, consistent token system on its own
 * (each step is a fixed `rem` value derived from one base unit) — wrapping
 * it in a second, parallel `--icon-size-*` CSS var layer would just be
 * indirection with no behavioral or override benefit, since nothing needs
 * an icon size independently overridable from the rest of the spacing
 * scale. What was actually missing (per `DESIGN_REFERENCE.md`'s "cover all
 * the elements" audit) wasn't a value — every step below already existed,
 * consistently, before this comment — it was *which step to reach for*:
 *
 * - `h-3 w-3` (12px, "xs") — a glyph nested inside another already-sized
 *   control: `Checkbox`'s check/indeterminate mark, `Chip`'s remove icon,
 *   `Tree`/`TreeTable`'s expand chevron, `MultiSelect`'s item checkmark.
 * - `h-4 w-4` (16px, "sm") — the default. Standalone icons in buttons, menu
 *   items, form-field adornments, and most inline icons not covered by
 *   another row here. Reach for this first; only step away from it for one
 *   of the specific reasons below.
 * - `h-5 w-5` (20px, "md") — an icon carrying more visual weight than a
 *   neighboring `sm` icon would: `Rating`'s stars, `BottomNav`'s nav icons
 *   (a primary navigation surface, not an inline affordance), `Spinner`'s
 *   own default size.
 * - `h-6 w-6`/`h-7 w-7` (24-28px, "lg") — a larger tap target around the
 *   icon itself, not just a bigger glyph: `Calendar`'s prev/next month
 *   buttons size the *button* to `h-7 w-7` with a `h-4 w-4` icon inside, for
 *   touch-target area rather than icon emphasis.
 *
 * New components should default to `sm` and only pick `xs`/`md`/`lg` for
 * one of the reasons above — not by eyeballing a size that looks right next
 * to whatever's already on screen.
 */

/**
 * Focus-ring offset convention (also documented, not tokenized — same
 * reasoning as the icon-size convention above: `ring-offset-1`/`-2` are
 * already Tailwind's own systematic scale, nothing new to add). An audit
 * found this split across ~48 files initially read as arbitrary
 * inconsistency, but component-by-component it's actually a real, mostly-
 * already-followed rule — formalizing it here so new components pick
 * consistently instead of by eye:
 *
 * - `ring-offset-2` — small, boxy selection controls where the ring needs
 *   visible separation from an already-small target: `Checkbox`, `Switch`,
 *   `CheckboxGroupItem`, `RadioGroupItem`.
 * - `ring-offset-1` — standalone controls with their own visual weight
 *   (border, fill, or size) where a smaller offset already reads clearly:
 *   `Button`, `Input`, `Textarea`, `FAB`, `Slider` thumb, `NumberInput`
 *   field, `OTPInput` slot, `ColorPicker` trigger/hex input, and the
 *   dismiss/action button family sitting on an overlay surface
 *   (`Dialog`/`Popover`/`Drawer`/`AlertDialog`'s close+action buttons,
 *   `Toast`'s close+action, `FileUpload`'s remove trigger).
 * - `ring-inset` — full-width or strip-embedded controls where an *outward*
 *   ring would get clipped by a parent's overflow or read oddly against
 *   neighboring items: `Tab`, `AccordionTrigger`.
 * - no offset — compact controls embedded in a list, row, or toolbar, where
 *   the ring is meant to hug the element rather than float apart from it:
 *   menu/nav items, pagination links, carousel arrows/indicators, tree
 *   items, stepper triggers, toggle-group/segmented-control items, table
 *   headers, and boxed field triggers (`Select`/`Combobox`/`MultiSelect`/
 *   `DatePicker` and friends) that already carry their own border.
 *
 * Ring *color* is a separate, already-covered concern — see `Button`'s own
 * doc comment and `CONTRAST_AUDIT.md`'s "Focus-ring color audit" section for
 * why almost everything rings `--color-base-content` (or, for `Checkbox`/
 * `Switch`/`RadioGroup`/the calendar/pagination/tree/etc.-active family
 * covered there, `--color-primary` — confirmed safe at 14.82:1 light /
 * 3.97:1 dark against `base.100`), not a raw per-component state color.
 */

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
 * Transition durations and easing — theme-independent, no light/dark
 * variant. `durationFast`/`durationSlow` aren't invented values: they
 * promote durations that were already hardcoded ad hoc across several
 * components (`durationFast` was `Popover`/`Menu`/`NavigationMenu`'s own
 * `duration-150`; `durationSlow` was `Progress`/`CircularProgress`/
 * `Carousel`'s own `duration-300`) into one shared, overridable token each
 * consumer now reads instead of repeating the literal. `durationBase` is
 * new — the middle tier for components that had no explicit duration at
 * all (`Dialog`/`AlertDialog`/`HoverCard`/`Drawer`), previously relying on
 * Tailwind's implicit default (or, for `Dialog`/`AlertDialog`/`HoverCard`,
 * no transition whatsoever). `easeOut` is a real cubic-bezier rather than
 * Tailwind's bare `ease-out` keyword so the curve itself is a named,
 * overridable token too, not just the duration.
 */
const motion = {
  durationFast: '150ms',
  durationBase: '200ms',
  durationSlow: '300ms',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

/**
 * Two named shadow tiers for floating/overlay surfaces — formalizes a
 * distinction that already existed as two different hardcoded Tailwind
 * shadow classes with no shared name: `modal` (`shadow-lg`'s value) for
 * surfaces that take over the interaction — `Dialog`, `AlertDialog`,
 * `Drawer`, `Toast`, `FAB` — and `anchored` (`shadow-md`'s value) for
 * surfaces that follow a trigger — `Popover`, `Menu` (and its
 * `DropdownMenu`/`ContextMenu` variants), `NavigationMenu`, `Select`,
 * `Combobox`, `MultiSelect`, `HoverCard`, `Tooltip`. Deliberately distinct
 * from `Card`/`Paper`'s own `elevation` prop (0-3, `shadow-none` through
 * `shadow-lg`) — that's a per-instance design choice for content surfaces;
 * this is a fixed property of what *kind* of overlay a component is.
 * Literal shadow values (not `shadow-md`/`shadow-lg` class references) so
 * these are real, independent, themeable tokens.
 */
const elevation = {
  anchored: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  modal: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

/**
 * Formalizes the 4-tier stacking order every floating/sticky component
 * already followed by convention (each documented in its own file) but
 * never shared as a named scale: `local` (in-component stacking — carousel
 * nav arrows, adjacent-button focus rings), `sticky` (`SaasAppHeader`),
 * `bottomNav` (`BottomNav`, deliberately below every overlay), `overlay`
 * (every `Dialog`/`Popover`/`Menu`/`Drawer`/`Toast`/... floating surface —
 * always the topmost layer). Pure codification: the numeric values are
 * unchanged from what was already hardcoded per file.
 */
const zIndex = {
  local: '10',
  sticky: '30',
  bottomNav: '40',
  overlay: '50',
} as const;

/**
 * The full primitive token tree — raw values only, grouped by category.
 *
 * @example
 * ```ts
 * import { primitiveTokens } from '@nebula-lab/react-ui/tokens';
 *
 * // Only for use inside semantic.ts / component.ts — never import this
 * // directly into a component or story.
 * const brandPrimary = primitiveTokens.color.primary;
 * ```
 */
const primitiveTokens = { color, radius, size, effect, fontStack, motion, elevation, zIndex } as const;

export { primitiveTokens };
