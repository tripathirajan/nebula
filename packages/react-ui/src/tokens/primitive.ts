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
    light200: 'oklch(98.12% 0.0034 247.858)',
    light300: 'oklch(92% 0.004 286.32)',
    // Was 'oklch(21% 0.006 285.885)' — 17.73:1 against white, effectively
    // flat black with negligible chroma. Softened to the same soft
    // charcoal-blue family the dark-tier trio above uses (reusing
    // `dark100`'s own value) — 15.52:1 against white, still far past AAA's
    // 7:1, just no longer "the darkest possible black" the project owner
    // flagged directly.
    lightContent: 'oklch(25.99% 0.0213 248.655)',
    // Dark-tier trio provided directly by the project owner as real RGB
    // values (rgb(28,37,46) / rgb(20,26,33) / rgb(40,50,61)), converted to
    // OKLCH via the same sRGB->linear->OKLab pipeline `contrast-audit.ts`
    // uses in reverse — not hand-approximated. Supersedes the earlier
    // `dark200` fix (widening the gap from `dark100` so Card wasn't the
    // literal same fill as the page canvas in dark mode, see git history) —
    // these three values already have real, distinct separation from each
    // other by construction, so that fix's specific numbers are moot, but
    // the underlying wiring it depended on (page canvas -> base-200, Card
    // -> base-100) is unchanged and still required.
    dark100: 'oklch(25.99% 0.0213 248.655)',
    dark200: 'oklch(21.50% 0.0165 252.504)',
    dark300: 'oklch(31.26% 0.0241 251.039)',
    darkContent: 'oklch(97.807% 0.029 256.847)',
  },
  // Second reskin pass — palette swapped to match a new reference style
  // guide (Primary #5A6FFA / Secondary #2C3D9F, provided directly). Neither
  // hex is used verbatim:
  //
  // - `#5A6FFA` (oklch 60.26% 0.2069 272.161) fails WCAG 1.4.3 with white
  //   button text (4.13:1, needs 4.5:1 — same class of failure the first
  //   reskin pass's `primary` hit, verified the same way, not eyeballed).
  // - Separately, the project owner asked for "decent tone... not high
  //   contrast or high saturated color" — `0.2069` chroma is a fairly vivid
  //   violet-blue. Rather than only fixing contrast (darken-only would keep
  //   the full saturation), chroma is cut to `0.12` (~42% reduction) *and*
  //   lightness adjusted for contrast — a muted slate-indigo, not the
  //   source's vivid periwinkle. Confirmed with the project owner (picked
  //   from 3 computed options) before landing, same confirm-before-landing
  //   discipline the first reskin pass's `primary` decision used.
  //
  // Result: oklch(55.75% 0.12 272.161) / #5C6DBA, 4.81:1 with white.
  primary: 'oklch(55.75% 0.12 272.161)',
  primaryContent: 'oklch(100% 0 0)',
  // For `primary` used as *inline text on base.100* (links, active
  // `SideNavItem` text, `Button`'s `ghost`/`text`/`link` variants). Light
  // reuses `primary` itself (4.81:1 vs white — already computed above).
  // Dark needs a brighter step since `primary`'s 55.75% lightness only
  // reads ~4:1 against dark-mode `base.100` — reuses the ramp's own
  // `light` step below (10.37:1 against `base.dark200`).
  // `light` is darkened below `primary` itself (55.75% -> 48%), not equal
  // to it — real bug caught by Storybook's a11y addon on `SideNavItem`'s
  // active state: `primaryText.light` used to just equal `primary`, which
  // clears 4.5:1 against pure white `base.100` (4.81:1) but NOT against the
  // 12% `color-mix(in oklch, primary, transparent)` tinted background
  // `SideNavItem`/`Button`'s `ghost` variant actually render behind this
  // text (axe measured 4.16:1 there) — `contrast-audit.ts`'s token-level
  // check only ever verified against plain `base.100`, the same class of
  // gap `primary-text`'s `Button` ghost fix hit earlier. Darkened with
  // real margin against the tinted case, not just barely clearing it.
  primaryText: {
    light: 'oklch(48% 0.12 272.161)',
    dark: 'oklch(80.44% 0.075 272.161)',
  },
  // Full lightest→darkest ramp, regenerated at the new hue (272.161) so it
  // stays a coherent family with `primary` above rather than keeping the
  // old hue (250.999) the previous palette's ramp was measured at.
  // Lightness steps carried over unchanged from the first reskin pass's
  // ramp shape; chroma tapered down at both extremes (same "muted, not
  // vivid" instruction `primary` itself follows) rather than held flat.
  primaryLightest: 'oklch(95.17% 0.026 272.161)',
  primaryLighter: 'oklch(87.72% 0.055 272.161)',
  primaryLight: 'oklch(80.44% 0.075 272.161)',
  primaryDark: 'oklch(45.00% 0.14 272.161)',
  primaryDarker: 'oklch(35.74% 0.11 272.161)',
  primaryDarkest: 'oklch(26.75% 0.075 272.161)',
  // Style guide's Secondary (`#2C3D9F`, oklch 41.04% 0.1593 270.208) — a
  // full hue swap from the previous palette's orange-hued secondary
  // (hue 58.318), per "follow this color scheme." Chroma cut to `0.11`
  // (from `0.1593`) for the same "decent tone" reason `primary`'s chroma
  // was cut, lightness held at the source's own 41.04% (already dark
  // enough that no contrast-driven adjustment was needed).
  // Result: oklch(41.04% 0.11 270.208) / #344586.
  secondary: 'oklch(41.04% 0.11 270.208)',
  // White passes easily against the new secondary (9.02:1) — secondary is
  // dark enough on its own, unlike the old orange-hued secondary which
  // needed a dedicated dark shade here.
  secondaryContent: 'oklch(100% 0 0)',
  // For `secondary` used as *inline text on base.100* — light reuses
  // `secondary` itself (9.02:1 vs `base.100`, same reasoning `primaryText`
  // above uses). Dark needs a lighter step for legibility against
  // `base.dark200` — 12.03:1, comfortable margin.
  secondaryText: {
    light: 'oklch(41.04% 0.11 270.208)',
    dark: 'oklch(85% 0.08 270.208)',
  },
  accent: 'oklch(65% 0.241 354.308)',
  // Same fix and reasoning as `primaryContent` above — the source theme's
  // `oklch(97%.../94%...)` near-white pair failed at 3.35:1/3.05:1 against
  // `accent`. 5.00:1 against `accent`.
  accentContent: 'oklch(20% 0.05 354.308)',
  // Same role/reasoning as `secondaryText` above — raw `accent` fails as
  // text in both themes (3.67:1 light, 4.11:1 dark), so both need a
  // dedicated shade, not just light. 14.40:1 light / 6.85:1 dark against
  // `base.100`.
  accentText: {
    light: 'oklch(30% 0.12 354.308)',
    dark: 'oklch(80% 0.18 354.308)',
  },
  neutral: {
    light: 'oklch(44% 0.043 257.281)',
    lightContent: 'oklch(98% 0 0)',
    dark: 'oklch(96% 0.003 264.542)',
    darkContent: 'oklch(27% 0.033 256.848)',
  },
  // Nebula-reskin semantic palette — `main` values measured live off real
  // status chips (banking table, both themes) or (`info`) inferred from the
  // source kit's conventional light-blue info role, per the reskin doc's
  // §Color. `Content` (text-on-fill) values are NOT the source kit's own —
  // white fails badly against every one of these fills (info 2.37:1,
  // success 2.28:1, warning 1.90:1, error 3.17:1; verified the same way the
  // `primary` adjustment above was), so each gets a real, computed dark
  // same-hue shade instead, continuing this theme's own pre-existing
  // pattern (the old `successContent`/`warningContent`/`errorContent`
  // values below were already dark, non-white shades before this reskin —
  // this isn't a new technique, just corrected math for new hues).
  info: 'oklch(72.15% 0.1287 216.761)',
  infoContent: 'oklch(30.89% 0.0575 222.858)',
  // For `info` used as *inline text on base.100* — same role
  // `successText`/`errorText`/etc. serve. Raw `info` fails in light mode
  // (2.37:1) exactly like every other fill above, passes comfortably in
  // dark (7.39:1) — reuses `infoContent`'s already-computed dark shade for
  // light mode (same target: dark, same-hue, legible on white) rather than
  // deriving a third value that would land in the same place anyway.
  infoText: {
    light: 'oklch(30.89% 0.0575 222.858)',
    dark: 'oklch(72.15% 0.1287 216.761)',
  },
  success: 'oklch(72.27% 0.1920 149.579)',
  successContent: 'oklch(30.62% 0.0960 145.103)',
  successText: {
    light: 'oklch(30.62% 0.0960 145.103)',
    dark: 'oklch(72.27% 0.1920 149.579)',
  },
  warning: 'oklch(80.34% 0.1704 73.788)',
  warningContent: 'oklch(30.10% 0.0721 57.955)',
  // Raw `warning` is the worst offender of the four measured this session —
  // 1.90:1 with white as `Content`, 1.90:1 as light-mode inline text (same
  // fill, same failure). Dark mode passes at 9.24:1 either way.
  warningText: {
    light: 'oklch(30.10% 0.0721 57.955)',
    dark: 'oklch(80.34% 0.1704 73.788)',
  },
  error: 'oklch(67.90% 0.2114 34.020)',
  // 5.01:1 against `error` — deliberately darker than the first candidate
  // tried (4.51:1, too thin a margin to check in given every other pairing
  // in this file lands 5:1+).
  errorContent: 'oklch(26.40% 0.0990 32.399)',
  errorText: {
    light: 'oklch(26.40% 0.0990 32.399)',
    dark: 'oklch(67.90% 0.2114 34.020)',
  },
  // 9-step neutral scale, theme-independent (one set of greys, `base.*`
  // above decides which end of it each theme's page/card/text roles pull
  // from). Deliberately not a generic stock neutral grey — derived from
  // `#919EAB`, the same blue-tinted anchor `base.dark100`'s divider and
  // `text.secondary` (`base.lightContent`'s sibling role, see `semantic.ts`)
  // already key off. Using stock neutral grey here would visibly clash with
  // those already-real, already-shipped tokens.
  grey: {
    50: 'oklch(99.33% 0.0011 197.139)',
    100: 'oklch(98.12% 0.0034 247.858)',
    200: 'oklch(92.91% 0.0069 247.899)',
    300: 'oklch(85.04% 0.0131 244.281)',
    400: 'oklch(69.32% 0.0242 248.177)',
    500: 'oklch(54.74% 0.0291 244.757)',
    600: 'oklch(42.34% 0.0238 253.084)',
    700: 'oklch(25.99% 0.0213 248.655)',
    800: 'oklch(21.50% 0.0165 252.504)',
    900: 'oklch(16.65% 0.0124 254.168)',
  },
} as const;

/**
 * Per-component corner radius — a fixed value per component *role* rather
 * than a numeric scale (DaisyUI's convention), so a consumer can dial in
 * "pill-shaped buttons but square cards" by overriding one custom property
 * without touching any others. See `component.ts` for how these become CSS
 * vars.
 *
 * `card`/`button`/`field`/`popover`/`dialog`/`avatar` below are reskinned
 * per the design doc's §Shape — real values measured off the source kit
 * (card/button), or deliberately aligned to one of those two so adjacent
 * surfaces don't visually clash (field matches button; dialog matches
 * card; avatar becomes a true circle, not a large pill radius). Everything
 * else (`selector`/`box`/`menu`/`tooltip`/`progress`) is unchanged — not
 * measured against the source kit, left as-is rather than guessed.
 */
const radius = {
  selector: '2rem',
  // Aligned to `button`, not left at the old `1rem` — inputs and buttons
  // sit side-by-side in every real form, and a mismatched radius between
  // them reads as an error, not a style choice.
  field: '0.5rem',
  box: '2rem',
  button: '0.5rem',
  card: '1rem',
  // Matches `card` — a dialog is a card that floats (see `elevation.modal`
  // below, which now shares `card`'s shadow family too).
  dialog: '1rem',
  badge: '2rem',
  chip: '2rem',
  // True circle, not a large pill radius — visually distinct from
  // `badge`/`chip`'s pill at small sizes even though both render as
  // `border-radius: 2rem` today; `50%` is the correct value regardless of
  // the element's own size, `2rem` only reads as circular by coincidence
  // at the specific sizes `Avatar` happens to use.
  avatar: '50%',
  menu: '2rem',
  // Deliberately smaller than every other role here: `--radius-popover`
  // backs every floating list/panel surface (`Popover`, `Menu` and its
  // `ContextMenu`/`Menubar`/`DropdownMenu` variants, `Combobox`, `Select`,
  // `MultiSelect`, `HoverCard` — see each `*-content.tsx`'s
  // `rounded-[var(--radius-popover)]`), all of which pad their content by
  // only `p-1`. Was already the smallest role before this reskin
  // (`0.75rem` vs `2rem` everywhere else) for exactly this reason; now
  // aligned to `button`'s new `0.5rem` instead of sitting at its own
  // independent value, since both are now "the restrained end of the
  // scale" rather than one pill-radius exception among many.
  popover: '0.5rem',
  tooltip: '2rem',
  progress: '2rem',
  // Deliberately its own role rather than reusing `box` (both were `2rem`
  // until this was split out): an `Alert` is a static, always-visible
  // status message sitting inline in a page's content flow, not a
  // floating/pill-shaped surface — a full `2rem` pill radius reads as
  // over-rounded for a rectangular block of body text next to other
  // square-ish content. `1rem` keeps the softened-corner language every
  // other surface in this theme uses without the pill look. Now the same
  // value as `card`/`dialog` — no longer a special case, just this
  // theme's one non-pill radius, shared by every non-pill surface.
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

// `'Public Sans Variable'` is self-hosted, not a CDN link — see
// `../fonts.css` (a hand-authored file, not generated by `generate.ts`,
// since font binary data has no source token to regenerate from). A
// consumer who only imports `theme.css` and skips `fonts.css` gets the
// exact same fallback stack this theme already shipped with — the font
// name is additive, nothing breaks if it's never loaded.
const fontStack = {
  sans: "'Public Sans Variable', system-ui, 'Segoe UI', Roboto, sans-serif",
  heading: "'Public Sans Variable', system-ui, 'Segoe UI', Roboto, sans-serif",
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
 * Shadow tiers — reskinned per the design doc's §Shadows/§Elevation.
 * `card` is genuinely new: `Card` never had its own shadow token before
 * this (it only had `border`, see `component.ts`'s `cardTokens`) — flat
 * black-based shadows read muddy against a light-grey page, so every tier
 * here is colored (tinted toward this theme's own neutral grey in light
 * mode, pure black in dark mode, where a tinted shadow reads muddy
 * against an already-dark surface instead) rather than the old flat
 * `rgb(0 0 0 / alpha)` values.
 *
 * `anchored` (`Popover`/`Menu`/`Select`/`Tooltip`/etc. — surfaces that
 * follow a trigger) and `modal` (`Dialog`/`Drawer`/`Toast`/`FAB` —
 * surfaces that take over the interaction) keep their existing semantic
 * split and existing consumers, just updated values: `anchored` now
 * matches the measured "raised" tier, `modal` is one step stronger
 * (derived, not independently measured — reserved for a genuine
 * full-screen takeover, nothing built yet actually differs visually from
 * `anchored` at this tier). All three now vary by theme — plain strings
 * before this reskin, since flat black-based shadows needed no per-theme
 * distinction; colored ones do.
 */
const elevation = {
  card: {
    light: 'oklch(69.32% 0.0242 248.177 / 0.2) 0 0 2px, oklch(69.32% 0.0242 248.177 / 0.12) 0 12px 24px -4px',
    dark: 'rgb(0 0 0 / 0.2) 0 0 2px, rgb(0 0 0 / 0.12) 0 12px 24px -4px',
  },
  anchored: {
    light: 'oklch(69.32% 0.0242 248.177 / 0.24) 0 0 2px, oklch(69.32% 0.0242 248.177 / 0.24) 0 20px 40px -4px',
    dark: 'rgb(0 0 0 / 0.24) 0 0 2px, rgb(0 0 0 / 0.28) 0 20px 40px -4px',
  },
  modal: {
    light: 'oklch(69.32% 0.0242 248.177 / 0.28) 0 0 4px, oklch(69.32% 0.0242 248.177 / 0.32) 0 32px 64px -8px',
    dark: 'rgb(0 0 0 / 0.28) 0 0 4px, rgb(0 0 0 / 0.36) 0 32px 64px -8px',
  },
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
