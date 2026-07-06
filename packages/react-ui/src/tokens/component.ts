/**
 * Layer 3 — component tokens: every styled component in this package gets
 * its own `<component>Tokens` entry here, and every class in that
 * component's `.tsx` file that needs a color reads it through this layer
 * (`var(--button-primary-bg)`) rather than reaching into a semantic token
 * directly (`var(--color-primary)`). `generate.ts` flattens each entry into
 * `--<component>-<role>-<property>` custom properties (e.g.
 * `buttonTokens.primary.bg` -> `--button-primary-bg`), so this file is the
 * single place that decides which semantic color a component uses — a
 * consumer who wants to restyle just `Badge`'s `info` variant overrides
 * `--badge-info-bg` without needing to know (or accidentally also affect)
 * anything else reading `--color-info`.
 *
 * Values are always `var(--color-...)` references into the *semantic*
 * layer, never a raw color — so nothing here needs its own light/dark
 * variant, it inherits whichever theme is active through the underlying
 * semantic variable. See `generate.ts` for how this becomes CSS, and
 * `primitive.ts`/`semantic.ts` for the layer these all point into.
 */

/**
 * `secondary` maps to the `neutral` semantic role rather than `secondary` —
 * nebula's `secondary` variant means "muted/outline style," which is what
 * the old token set's `bg.subtle`/`text.default` pairing gave it, and
 * `neutral` is this theme's closest equivalent to that. DaisyUI's own
 * `secondary` is a second bold brand hue, not a muted style — if a future
 * variant wants that instead, add a fourth `Button` variant rather than
 * repointing this one (would be a visual break for anyone already using
 * `variant="secondary"`).
 */
const buttonTokens = {
  primary: {
    bg: 'var(--color-primary)',
    text: 'var(--color-primary-content)',
    border: 'var(--color-primary)',
  },
  secondary: {
    bg: 'var(--color-neutral)',
    text: 'var(--color-neutral-content)',
    border: 'var(--color-neutral)',
  },
  danger: {
    bg: 'var(--color-error)',
    text: 'var(--color-error-content)',
    border: 'var(--color-error)',
  },
} as const;

const inputTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
  ring: 'var(--color-base-content)',
  invalidBorder: 'var(--color-error)',
  invalidRing: 'var(--color-error)',
} as const;

const separatorTokens = {
  bg: 'var(--color-base-300)',
} as const;

const cardTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

/** All eight semantic color roles — unlike `Button` (3 variants), `Badge` is meant to show off the full palette. */
const badgeTokens = {
  primary: { bg: 'var(--color-primary)', text: 'var(--color-primary-content)' },
  secondary: { bg: 'var(--color-secondary)', text: 'var(--color-secondary-content)' },
  accent: { bg: 'var(--color-accent)', text: 'var(--color-accent-content)' },
  neutral: { bg: 'var(--color-neutral)', text: 'var(--color-neutral-content)' },
  info: { bg: 'var(--color-info)', text: 'var(--color-info-content)' },
  success: { bg: 'var(--color-success)', text: 'var(--color-success-content)' },
  warning: { bg: 'var(--color-warning)', text: 'var(--color-warning-content)' },
  danger: { bg: 'var(--color-error)', text: 'var(--color-error-content)' },
} as const;

const avatarTokens = {
  bg: 'var(--color-neutral)',
  text: 'var(--color-neutral-content)',
} as const;

const accordionTokens = {
  border: 'var(--color-base-300)',
  triggerHoverBg: 'var(--color-base-200)',
  text: 'var(--color-base-content)',
} as const;

const dialogTokens = {
  overlayBg: 'var(--color-base-content)',
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

const popoverTokens = {
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

/**
 * Deliberately reads `neutral`/`neutral-content` rather than the
 * `base-100`/`base-content` surface pair `Popover`/`Dialog` use — a tooltip
 * is a small, high-contrast label that should visually pop off the page
 * regardless of theme, not blend in as "more page surface" the way a
 * popover's content panel should. Same role `Avatar`/`Badge`'s `neutral`
 * variant plays.
 */
const tooltipTokens = {
  contentBg: 'var(--color-neutral)',
  contentText: 'var(--color-neutral-content)',
} as const;

const tabsTokens = {
  listBorder: 'var(--color-base-300)',
  triggerText: 'var(--color-base-content)',
  triggerActiveText: 'var(--color-primary)',
  triggerActiveBorder: 'var(--color-primary)',
} as const;

const checkboxTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  checkedBg: 'var(--color-primary)',
  checkedBorder: 'var(--color-primary)',
  icon: 'var(--color-primary-content)',
} as const;

const switchTokens = {
  trackBg: 'var(--color-base-300)',
  trackCheckedBg: 'var(--color-primary)',
  thumbBg: 'var(--color-base-100)',
} as const;

const radioTokens = {
  border: 'var(--color-base-300)',
  checkedBorder: 'var(--color-primary)',
  checkedDot: 'var(--color-primary)',
  text: 'var(--color-base-content)',
} as const;

/**
 * `trackBg`/`indicatorBg` reuse the same `base-300`/`primary` pairing
 * `switchTokens`'s track/thumb already does — a progress fill against its
 * own track isn't a WCAG text-contrast pairing (nothing here is text), same
 * exemption `separatorTokens`'s divider-on-page-background use already
 * relies on, so no new `CONTRAST_AUDIT.md` entry is needed.
 */
const progressTokens = {
  trackBg: 'var(--color-base-300)',
  indicatorBg: 'var(--color-primary)',
} as const;

/** Same `base-300`/`primary` pairing and rationale as `progressTokens` — a spinner ring isn't text either. */
const spinnerTokens = {
  track: 'var(--color-base-300)',
  indicator: 'var(--color-primary)',
} as const;

/** A skeleton placeholder is a decorative fill, not text — `base-300` alone (no paired foreground color) is all it needs. */
const skeletonTokens = {
  bg: 'var(--color-base-300)',
} as const;

/**
 * Aggregated per-component token overrides, keyed by component name.
 *
 * Radius/size/border/depth/noise/font tokens don't need an entry here —
 * unlike everything above, they're not per-variant color overrides, they're
 * theme-independent "shape" knobs that `generate.ts` reads straight from
 * `primitiveTokens.{radius,size,effect,fontStack}` and emits once into
 * `:root` (never duplicated into the `.dark` block, since none of them are
 * color).
 *
 * @example
 * ```ts
 * import { componentTokens } from '@nebula/react-ui/tokens';
 *
 * // Emitted as `--button-primary-bg` etc. by generate.ts; consume the CSS
 * // variable in a stylesheet rather than importing this object at runtime.
 * const primaryBg = componentTokens.button.primary.bg;
 * ```
 */
const componentTokens = {
  button: buttonTokens,
  input: inputTokens,
  separator: separatorTokens,
  card: cardTokens,
  badge: badgeTokens,
  avatar: avatarTokens,
  accordion: accordionTokens,
  dialog: dialogTokens,
  popover: popoverTokens,
  tooltip: tooltipTokens,
  tabs: tabsTokens,
  checkbox: checkboxTokens,
  switch: switchTokens,
  radio: radioTokens,
  progress: progressTokens,
  spinner: spinnerTokens,
  skeleton: skeletonTokens,
} as const;

export {
  componentTokens,
  buttonTokens,
  inputTokens,
  separatorTokens,
  cardTokens,
  badgeTokens,
  avatarTokens,
  accordionTokens,
  dialogTokens,
  popoverTokens,
  tooltipTokens,
  tabsTokens,
  checkboxTokens,
  switchTokens,
  radioTokens,
  progressTokens,
  spinnerTokens,
  skeletonTokens,
};
