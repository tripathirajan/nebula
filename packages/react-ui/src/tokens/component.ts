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

const paginationTokens = {
  linkText: 'var(--color-base-content)',
  linkHoverBg: 'var(--color-base-200)',
  linkActiveBg: 'var(--color-primary)',
  linkActiveText: 'var(--color-primary-content)',
} as const;

/** Same `base-content`/`primary` pairing `paginationTokens.linkActiveBg`/`-Text` use — the active step's fill. */
const stepperTokens = {
  text: 'var(--color-base-content)',
  indicatorBg: 'var(--color-base-200)',
  indicatorText: 'var(--color-base-content)',
  activeIndicatorBg: 'var(--color-primary)',
  activeIndicatorText: 'var(--color-primary-content)',
  completeIndicatorBg: 'var(--color-primary)',
  completeIndicatorText: 'var(--color-primary-content)',
  separator: 'var(--color-base-300)',
} as const;

const treeTokens = {
  text: 'var(--color-base-content)',
  hoverBg: 'var(--color-base-200)',
  selectedBg: 'var(--color-primary)',
  selectedText: 'var(--color-primary-content)',
} as const;

/**
 * `NavigationMenuContent` reuses the same `base-100`/`base-300`/`base-content`
 * surface triple `Popover`/`Dialog` use — a mega-menu panel is "more page
 * surface," not a high-contrast callout the way `Tooltip` is.
 */
const navigationMenuTokens = {
  triggerText: 'var(--color-base-content)',
  triggerHoverBg: 'var(--color-base-200)',
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  linkActiveText: 'var(--color-primary)',
} as const;

const drawerTokens = {
  overlayBg: 'var(--color-base-content)',
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

const hoverCardTokens = {
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

/**
 * A toast is a small high-contrast callout that should visually pop off the
 * page (like `tooltipTokens`), not blend in as page surface — same
 * `neutral`/`neutral-content` reasoning.
 */
const toastTokens = {
  bg: 'var(--color-neutral)',
  text: 'var(--color-neutral-content)',
  border: 'var(--color-neutral)',
} as const;

const commandTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
  itemHighlightedBg: 'var(--color-base-200)',
} as const;

/** Nav buttons read the same `base-100`/`base-300`/`base-content` surface triple `Popover`/`Dialog` use; the indicator dots' active fill reuses `primary`, same "small pop of the theme's brand color" role `switchTokens`'s checked track plays. */
const carouselTokens = {
  navBg: 'var(--color-base-100)',
  navBorder: 'var(--color-base-300)',
  navText: 'var(--color-base-content)',
  indicatorBg: 'var(--color-base-300)',
  indicatorActiveBg: 'var(--color-primary)',
} as const;

const dataTableTokens = {
  border: 'var(--color-base-300)',
  headText: 'var(--color-base-content)',
  text: 'var(--color-base-content)',
  rowHoverBg: 'var(--color-base-200)',
  rowSelectedBg: 'var(--color-base-200)',
} as const;

/**
 * Shared between `Droppable`'s and `SortableItem`'s "you can drop here"
 * outline — one token rather than two identical ones, since they're
 * genuinely the same visual affordance for the same drag-and-drop
 * interaction, not two independently-themeable components.
 */
const dndTokens = {
  dropRing: 'var(--color-primary)',
} as const;

/** Same `base-100`/`base-300`/`base-content` surface treatment as `Input`. */
const selectTokens = {
  triggerBg: 'var(--color-base-100)',
  triggerBorder: 'var(--color-base-300)',
  triggerText: 'var(--color-base-content)',
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
  itemHighlightedBg: 'var(--color-base-200)',
} as const;

/** Same shape as `selectTokens` — `Combobox`'s input reuses `Input`'s own surface treatment, its popover reuses `Select`'s. */
const comboboxTokens = {
  inputBg: 'var(--color-base-100)',
  inputBorder: 'var(--color-base-300)',
  inputText: 'var(--color-base-content)',
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
  itemHighlightedBg: 'var(--color-base-200)',
} as const;

/**
 * `itemFocusBg` backs every `MenuItem`/`MenuCheckboxItem`/`MenuRadioItem`'s
 * real `:focus` highlight (see `menu-item.tsx`'s doc comment on why this is
 * plain focus, not `:focus-visible`); `content*` is the same
 * `base-100`/`base-300`/`base-content` surface triple `Popover`/`Select` use.
 */
const menuTokens = {
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
  itemFocusBg: 'var(--color-base-200)',
  separator: 'var(--color-base-300)',
} as const;

/**
 * `Menubar`'s own root chrome (the horizontal bar itself) and its
 * trigger buttons' hover/open state — `Menubar`'s dropdown panels reuse
 * `menuTokens` directly (see `menubar-content.tsx`), so this only needs the
 * two things `Menu`'s tokens don't already cover.
 */
const menubarTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  triggerText: 'var(--color-base-content)',
  triggerHoverBg: 'var(--color-base-200)',
  triggerOpenBg: 'var(--color-base-200)',
} as const;

const breadcrumbTokens = {
  text: 'var(--color-base-content)',
  linkHoverText: 'var(--color-primary)',
  currentText: 'var(--color-base-content)',
} as const;

/** Just the swatch's frame — the fill itself is the picker's current value, set inline by the headless source, not read from here. */
const colorPickerTokens = {
  swatchBorder: 'var(--color-base-300)',
} as const;

/** Same `base-content`/`primary` pairing `paginationTokens.linkActiveBg`/`-Text` and `stepperTokens`'s active fill use — the filled-star's color. */
const ratingTokens = {
  empty: 'var(--color-base-300)',
  filled: 'var(--color-primary)',
} as const;

const fileUploadTokens = {
  text: 'var(--color-base-content)',
  dropzoneBorder: 'var(--color-base-300)',
  dropzoneActiveBorder: 'var(--color-primary)',
  itemBorder: 'var(--color-base-300)',
} as const;

const sliderTokens = {
  trackBg: 'var(--color-base-300)',
  rangeBg: 'var(--color-primary)',
  thumbBg: 'var(--color-base-100)',
  thumbBorder: 'var(--color-primary)',
} as const;

const fieldTokens = {
  labelText: 'var(--color-base-content)',
  descriptionText: 'var(--color-base-content)',
  errorText: 'var(--color-error)',
} as const;

/** Same `base-content`/`primary`-adjacent "filled when active" treatment `paginationTokens`'s active link and `stepperTokens`'s active indicator use. */
const toggleTokens = {
  text: 'var(--color-base-content)',
  hoverBg: 'var(--color-base-200)',
  onBg: 'var(--color-base-200)',
  onText: 'var(--color-base-content)',
} as const;

const toggleGroupTokens = {
  border: 'var(--color-base-300)',
} as const;

const collapsibleTokens = {
  text: 'var(--color-base-content)',
} as const;

/** Same `base-100`/`base-300`/`base-content` surface triple `Card`/`Popover`/`Dialog` use. */
const headerTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

/** Same surface triple as `headerTokens` — kept as its own entry (rather than reusing `headerTokens` directly) so `Header`/`Footer` stay independently themeable, per `component.ts`'s own per-component-indirection rule. */
const footerTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

/** Same surface triple as `headerTokens`/`footerTokens`. */
const sidebarTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

/** No border — a `Navbar` is usually nested inside a `Header` that already has one. */
const navbarTokens = {
  bg: 'var(--color-base-100)',
  text: 'var(--color-base-content)',
} as const;

/** No border/radius — the plainest possible themed background, one step below `Card`/`Paper`. */
const surfaceTokens = {
  bg: 'var(--color-base-200)',
  text: 'var(--color-base-content)',
} as const;

/** Same surface triple `Card` uses — `Paper` and `Card` are visually identical surfaces, just with (`Card`) or without (`Paper`) the compound header/title/footer sub-parts. */
const paperTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

/** Shared by `Text` and `Heading` — this theme's default body text color. */
const textTokens = {
  color: 'var(--color-base-content)',
} as const;

/** Overrides `@nebula/primitives`' `Code`'s hardcoded pre-token-system `bg-gray-100` (see `code.tsx`'s doc comment). */
const codeTokens = {
  bg: 'var(--color-base-200)',
  text: 'var(--color-base-content)',
} as const;

const blockquoteTokens = {
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

const kbdTokens = {
  bg: 'var(--color-base-200)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
} as const;

/** The ring separating overlapped avatars reads the page background, not a semantic color — same "not a text pairing" exemption `separatorTokens` relies on. */
const avatarGroupTokens = {
  ring: 'var(--color-base-100)',
} as const;

/** Only `neutral`/`primary` — unlike `Badge`/`Tag`'s full eight-role palette, a dismissible filter/selection chip only needs "default" vs. "actively applied," not a full status vocabulary. */
const chipTokens = {
  neutralBg: 'var(--color-base-200)',
  neutralText: 'var(--color-base-content)',
  primaryBg: 'var(--color-primary)',
  primaryText: 'var(--color-primary-content)',
} as const;

const statTokens = {
  labelText: 'var(--color-base-content)',
  valueText: 'var(--color-base-content)',
} as const;

/** Purely presentational structure (no interactive state), same single-color treatment as `Text`. */
const listTokens = {
  text: 'var(--color-base-content)',
} as const;

/** `DescriptionTerm`/`DescriptionDetails` read separate tokens even though both currently resolve to `base-content` — kept independently themeable per the per-component indirection rule, same as `Header`/`Footer`/`Sidebar` all sharing one triple. */
const descriptionListTokens = {
  termText: 'var(--color-base-content)',
  detailsText: 'var(--color-base-content)',
} as const;

/** Same `base-300`/`base-content` surface as `dataTableTokens`, plus a distinct `headerBg`/`rowHoverBg` pair since the virtualized rows scroll under a header that must stay visually separated (`dataTable`'s un-virtualized `<thead>` doesn't need its own background — it relies on border alone). */
const dataGridTokens = {
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
  headText: 'var(--color-base-content)',
  headerBg: 'var(--color-base-200)',
  rowHoverBg: 'var(--color-base-200)',
} as const;

/** Same `base-100`/`base-300`/`base-content` field treatment `selectTokens`/`inputTokens` use — `DatePicker`/`DateRangePicker` share this one object rather than each getting their own, since they're visually identical trigger buttons. */
const datePickerTokens = {
  triggerBg: 'var(--color-base-100)',
  triggerBorder: 'var(--color-base-300)',
  triggerText: 'var(--color-base-content)',
} as const;

/** `Calendar`'s day grid — `daySelectedBg`/`daySelectedText` reuse the `primary`/`primary-content` pair every other "actively chosen" state in this package uses (`SelectItem`'s checkmark, `PaginationLink`'s active page); `inRangeBg` is a lighter fill for the days between a range's two endpoints, distinct from either endpoint's own solid fill. */
const calendarTokens = {
  text: 'var(--color-base-content)',
  navHoverBg: 'var(--color-base-200)',
  weekdayText: 'var(--color-base-content)',
  dayHoverBg: 'var(--color-base-200)',
  daySelectedBg: 'var(--color-primary)',
  daySelectedText: 'var(--color-primary-content)',
  inRangeBg: 'var(--color-base-200)',
  outsideMonthText: 'var(--color-base-content)',
} as const;

/** `dot`/`line` are the same page-recedes-into-background pairing `separatorTokens`'s divider and `avatarGroupTokens`'s ring rely on — not a text-on-background pairing, so exempt from `CONTRAST_AUDIT.md` the same way. */
const timelineTokens = {
  dot: 'var(--color-primary)',
  line: 'var(--color-base-300)',
  titleText: 'var(--color-base-content)',
  descriptionText: 'var(--color-base-content)',
} as const;

/** Same `base-100`/`base-300`/`base-content` triple `selectTokens` uses for its trigger/content pair — a multi-select trigger/popup reads as the same kind of form field, just with a different summary-text/indicator shape (see `MultiSelectTrigger`/`MultiSelectItem`'s own doc comments). */
const multiSelectTokens = {
  triggerBg: 'var(--color-base-100)',
  triggerBorder: 'var(--color-base-300)',
  triggerText: 'var(--color-base-content)',
  contentBg: 'var(--color-base-100)',
  contentBorder: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
  itemHighlightedBg: 'var(--color-base-200)',
} as const;

/** `headerBg` is a step darker than `bg` (`base-200` vs `base-100`) so the language-label/copy-button row visually separates from the code itself without needing a border between them — same "one step further into the surface" relationship `dataGridTokens.headerBg` has to `dataGridTokens.border`. */
const codeBlockTokens = {
  bg: 'var(--color-base-100)',
  border: 'var(--color-base-300)',
  text: 'var(--color-base-content)',
  headerBg: 'var(--color-base-200)',
  headerText: 'var(--color-base-content)',
  lineNumberText: 'var(--color-base-content)',
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
  pagination: paginationTokens,
  stepper: stepperTokens,
  tree: treeTokens,
  navigationMenu: navigationMenuTokens,
  drawer: drawerTokens,
  hoverCard: hoverCardTokens,
  toast: toastTokens,
  command: commandTokens,
  carousel: carouselTokens,
  dataTable: dataTableTokens,
  dnd: dndTokens,
  select: selectTokens,
  combobox: comboboxTokens,
  menu: menuTokens,
  menubar: menubarTokens,
  breadcrumb: breadcrumbTokens,
  colorPicker: colorPickerTokens,
  rating: ratingTokens,
  fileUpload: fileUploadTokens,
  slider: sliderTokens,
  field: fieldTokens,
  toggle: toggleTokens,
  toggleGroup: toggleGroupTokens,
  collapsible: collapsibleTokens,
  header: headerTokens,
  footer: footerTokens,
  sidebar: sidebarTokens,
  navbar: navbarTokens,
  surface: surfaceTokens,
  paper: paperTokens,
  text: textTokens,
  code: codeTokens,
  blockquote: blockquoteTokens,
  kbd: kbdTokens,
  avatarGroup: avatarGroupTokens,
  chip: chipTokens,
  stat: statTokens,
  list: listTokens,
  descriptionList: descriptionListTokens,
  dataGrid: dataGridTokens,
  datePicker: datePickerTokens,
  calendar: calendarTokens,
  timeline: timelineTokens,
  multiSelect: multiSelectTokens,
  codeBlock: codeBlockTokens,
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
  paginationTokens,
  stepperTokens,
  treeTokens,
  navigationMenuTokens,
  drawerTokens,
  hoverCardTokens,
  toastTokens,
  commandTokens,
  carouselTokens,
  dataTableTokens,
  dndTokens,
  selectTokens,
  comboboxTokens,
  menuTokens,
  menubarTokens,
  breadcrumbTokens,
  colorPickerTokens,
  ratingTokens,
  fileUploadTokens,
  sliderTokens,
  fieldTokens,
  toggleTokens,
  toggleGroupTokens,
  collapsibleTokens,
  headerTokens,
  footerTokens,
  sidebarTokens,
  navbarTokens,
  surfaceTokens,
  paperTokens,
  textTokens,
  codeTokens,
  blockquoteTokens,
  kbdTokens,
  avatarGroupTokens,
  chipTokens,
  statTokens,
  listTokens,
  descriptionListTokens,
  dataGridTokens,
  datePickerTokens,
  calendarTokens,
  timelineTokens,
  multiSelectTokens,
  codeBlockTokens,
};
