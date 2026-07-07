# Layer Taxonomy — where a component goes

Reference document for the 5-tier pipeline confirmed with the project owner:

```
primitives → headless → styleless → react-ui → react-ui-blocks
(atoms +      (behavior/   (unstyled but   (themed)   (assembled
 plumbing)     ARIA only,   structurally                screens)
               no DOM       complete —
               opinion      Button/Input/
               beyond       Card/Table/
               semantics)   etc.)
```

**Naming note:** `headless` here is the *renamed* version of what this repo was calling `@nebula/styleless` (itself renamed from the original `@nebula/headless` — see task #17). **This rename is now done**: `packages/styleless` → `packages/headless` landed (package name, imports across the repo, tsconfig/eslint path references, story titles, docs). `styleless` is a genuinely **new** layer being introduced — it did not exist before this taxonomy and has not been built yet. This exact 5-tier model was independently reconfirmed by the project owner via a 4-question decision guide (Primitive → Headless → Styleless → React UI), now embedded verbatim in `AGENTS.md`'s "Layer placement" section — treat this taxonomy as locked, not tentative.

Status tags: **[built]** exists today (in `primitives` or `headless`, post-rename) · **[rename]** exists today under a different package/name · **[new]** doesn't exist in any layer yet.

---

## 0. Corrections to the source list (read before the tables)

The project owner's example list put a few things in a bucket the established criteria doesn't support. Flagging each so it's a decision, not a silent override:

1. **`Virtualizer` → `hooks`, not `headless`.** It renders zero DOM of its own — `useVirtualizer` (already built in `@nebula/hooks`) is pure windowing math a consumer wires to their own markup. Nothing about it is an ARIA widget pattern.
2. **`FocusScope`/`FocusTrap`/`FocusManager`/`FocusGuards`/`DismissableLayer`/`RovingFocusGroup`/`KeyboardDelegate`/`Typeahead`/`LiveRegion`/`DirectionProvider` → `primitives`, not `headless`.** These are cross-cutting plumbing *reused by* many unrelated `headless` widgets (`RovingFocusGroup` alone backs `Listbox`, `Menu`, `Tabs`, `ToggleGroup`, `Menubar` today) — none of them is itself a named WAI-ARIA *widget* pattern with its own `Root`/`Trigger`/`Content`. Four of these already exist in `@nebula/primitives` today; the rest are net-new primitives, not net-new headless components.
3. **`Floating`/`FloatingTree`/`FloatingList` → `primitives`.** Positioning plumbing (this repo's existing `Popper`), not a widget — every `headless` overlay (`Popover`, `Dialog`, `Select`, `Combobox`, ...) is a *consumer* of this, same relationship `RovingFocusGroup` has to the widgets built on it.
4. **`Field` appeared in both the source list's Primitives (`Forms`) and Styleless (`Form Infrastructure`) sections — resolved to `headless`, once.** It has real behavior (generates shared ids, wires `aria-describedby`/`aria-invalid` across `FieldLabel`/`FieldControl`/`FieldDescription`/`FieldError` via context) — that's exactly "behavior + accessibility + state, no visual opinion," i.e. `headless`'s own definition, not a bare atom.
5. **`NumberInput`/`OTPInput`/`PinInput` → `headless`, not `styleless`.** These have real compound behavior (increment/decrement clamping, per-digit focus advancement) beyond "a styled `<input>`" — same tier as `Slider`/`Rating`/`ColorPicker`, which the source list correctly put in `headless`. Plain preset inputs with no compound behavior (`SearchInput`, `PasswordInput`, `EmailInput`, `UrlInput`, `TelInput`, `CurrencyInput`, `MaskInput`) stay in `styleless` — they're just `type=`/`inputMode=` presets over the one real `Input`.
6. **`Fragment` is not a component to build — it's `React.Fragment`.** Not listed below. **`Polymorphic` is a type (`PolymorphicComponent<E, P>`), not a runtime component** — already exists in `@nebula/primitives/types`; not listed below as a buildable item.
7. **`Disclosure`** — same WAI-ARIA pattern as `Collapsible` (a single show/hide region), not a second component. Kept as one entry.
8. **`DateField`/`TimeField`** — these are the *headless, unstyled* input-group versions (segments for year/month/day etc., no calendar popup) that `DatePicker`/`TimePicker` (already built, react-ui-layer, native-input-backed) are a simpler alternative to. Real, non-trivial new headless components, not duplicates.

---

## 1. `hooks` — zero DOM, pure state/logic

Already covers this well; only addition from the source list:

- `useVirtualizer` **[built]** (was mis-bucketed as "headless > Collections" — see correction 1)

No other source-list item belongs here — everything else in "Headless Components" renders real DOM.

---

## 2. `primitives` — atoms + cross-cutting plumbing

### Core
`Primitive` **[built]** · `Slot` **[built]** · `Portal` **[built]** · `Presence` **[built]**

### Layout
`Box` **[built]** · `Flex` **[new]** · `Grid` **[new]** · `Stack` **[new]** · `HStack` **[built]** · `VStack` **[built]** · `Inline` **[new]** · `Wrap` **[built]** · `Spacer` **[built]** · `Center` **[new]** · `Container` **[new]** · `AspectRatio` **[new]** · `Separator` **[built]** (currently in `primitives`; a bare `Separator` is correctly atomic — the *styled* `react-ui` `Separator` reads its tokens directly today with no intermediate `styleless` version needed, since it has no state to decouple)

### Typography
`Text` **[built]** · `Heading` **[built]** · `Paragraph` **[new]** (thin `Text as="p"` preset) · `Label` **[built]** · `Link` **[new]** · `Code` **[built]** · `Kbd` **[new at this layer]** (currently a `react-ui`-only presentational component — reasonable to leave there; see note below) · `Blockquote` **[new at this layer]** (same note) · `Caption` **[new]** · `VisuallyHidden` **[built]**

> Note on `Kbd`/`Blockquote`: today these live directly in `react-ui` with no lower layer at all (purely presentational, no ARIA pattern, no state — same "skip straight to react-ui" rule `Card`/`Stat` already use). Moving them down into `primitives` is optional, not required by the criteria — either placement is defensible for a component with zero behavior; recommend leaving as-is rather than reshuffling working code for a cosmetic layer move.

### Media
`Image` **[built]** · `Picture` **[new]** · `Figure` **[new]** · `Figcaption` **[new]** · `Icon` **[new]** (a wrapper that normalizes `width`/`height`/`aria-hidden` around an arbitrary SVG icon set) · `Svg` **[new]** · `Canvas` **[new]**

### Forms (atoms only — compound behavior goes to `headless`, see correction 4)
`Form` **[new]** (a bare `<form>` `Primitive` wrapper, nothing more) · `Fieldset` **[new]** · `Legend` **[new]**

### Accessibility infrastructure (corrections 2)
`FocusScope` **[built]** · `FocusTrap` **[new]** (a focused-down convenience wrapper around `FocusScope`, if the two end up distinct) · `FocusManager` **[new]** · `FocusGuards` **[new]** · `DismissibleLayer` **[built]** · `RovingFocusGroup` **[built]** · `KeyboardDelegate` **[new]** · `Typeahead` **[new]** (already inlined per-component, e.g. `Listbox`'s own typeahead buffer — worth extracting to a shared primitive once a third consumer needs it, not before) · `LiveRegion` **[new]** · `DirectionProvider` **[new]** (RTL support — not started anywhere in this repo yet)

### Positioning infrastructure (correction 3)
`Popper` **[built]** (this repo's existing name for "Floating") · `FloatingTree` **[new]** · `FloatingList` **[new]**

---

## 3. `headless` (rename from `styleless` done) — one per named WAI-ARIA pattern

### Overlay
`Dialog` **[built]** · `AlertDialog` **[new at this layer]** (today built directly in `react-ui`, thinly re-exporting `Dialog` — reasonable to leave, since it adds no new behavior of its own, only different default styling; see `AGENTS.md`) · `Drawer` **[built]** · `Sheet` **[new at this layer]** (today a `react-ui`-layer renamed re-export of `Drawer`, same reasoning as `AlertDialog`) · `Popover` **[built]** · `Tooltip` **[built]** · `HoverCard` **[built]**

### Menus
`Menu` **[built]** · `DropdownMenu` **[built]** · `ContextMenu` **[built]** · `Menubar` **[built]** · `NavigationMenu` **[built]**

### Selection
`Select` **[built]** · `Combobox` **[built]** · `Listbox` **[built]** · `Command` **[built]** · `Autocomplete` **[built]**

### Disclosure
`Accordion` **[built]** · `Collapsible` **[built]** (covers `Disclosure` too — correction 7)

### Navigation
`Tabs` **[built]** · `Carousel` **[new at this layer]** (today built directly in `react-ui` — a project-owner call already documented, since its behavior is CSS-transform slide logic + consumer-supplied indices, not a bespoke ARIA state machine needing its own unstyled layer; leave as-is) · `Tree` **[built]** (covers `TreeView`, already a renamed re-export)

### Date & Time
`Calendar` **[new at this layer]** (today built directly in `react-ui` — plain native `Date` math + WAI-ARIA grid roles, no independent behavior/styling split the way `Combobox`'s virtual-highlight state has; leave as-is, same call as `Carousel`) · `DatePicker`/`DateRangePicker`/`TimePicker` **[new at this layer]** (same — today thin `react-ui`-layer `Popover`+`Calendar`/native-input compositions) · `DateField`/`TimeField` **[new]** (genuinely new — segmented, no-popup date/time entry; distinct from the above, see correction 8)

### Collections
`Sortable` **[new at this layer]** (today built directly in `react-ui` on the native HTML5 DnD API — no independent ARIA pattern, native browser semantics only; leave as-is) · `Draggable`/`Droppable` **[new at this layer]** (same) · `DragOverlay` **[new]** (a floating drag-preview layer — not built anywhere yet; real gap if drag-and-drop needs a custom preview instead of the browser's native ghost image)

### Layout Interaction
`ScrollArea` **[new]** · `Splitter` **[new]** · `Resizable` **[new]**

### Forms (moved down from the source list's Primitives/Styleless split — correction 4/5)
`Field` **[built]** · `NumberInput` **[built]** · `OTPInput` **[built]** · `PinInput` **[new]** (same pattern as `OTPInput`, different default formatting — worth confirming with the project owner whether this is a real second component or just `OTPInput` with a `mask` prop before building it twice)
`CheckboxGroup` **[built]** · `ToggleGroup` **[built]** · `Toggle` **[built]** · `Slider` **[built]** · `Rating` **[built]** · `ColorPicker` **[built]** · `FileUpload` **[built]** · `Checkbox`/`Switch`/`RadioGroup` **[built]**

### Navigation (structural, but with real keyboard/state behavior)
`Pagination` **[built]** · `Stepper` **[built]**

### Feedback
`Toast` **[built]**

### Collections (palette/search)
`Command` **[built]** — already listed under Selection above, not duplicated.

---

## 4. `styleless` (NEW layer) — functional + semantic + accessible, zero visual opinion

Everything below is, in today's repo, already built **styled** directly in `react-ui` (skipping an unstyled middle step). Building this layer means factoring an unstyled version out from underneath each `react-ui` component — real, non-trivial work per component, not a rename. Marked **[extract]** for exactly that reason, vs. **[new]** for things with no `react-ui` counterpart at all yet.

### Actions
`Button` **[built]** (extracted this session — `packages/styleless/src/button`; `react-ui`'s `Button` now wraps it and adds only `cva` styling) · `IconButton` **[extract]** · `ToggleButton` **[extract]** (today: `react-ui`'s `Toggle`, which is actually `headless`-tier per its real pressed-state behavior — clarify whether "ToggleButton" here means the same thing as `headless`'s `Toggle` or a distinct simpler on/off style button before building both) · `SplitButton` **[extract]** · `CloseButton` **[new]** (an icon-only dismiss button preset — `DialogClose`/`DrawerClose`/`AlertDialogCancel` all currently roll their own close-button markup inline; worth factoring out once a third+ consumer needs the identical shape) · `FloatingActionButton` **[extract]** (today `react-ui`'s `FAB`)

### Inputs
`Input` **[extract]** · `SearchInput` **[extract]** (today `react-ui`'s `SearchField`) · `PasswordInput` **[extract]** (today `react-ui`'s `PasswordField`) · `EmailInput`/`UrlInput`/`TelInput` **[new]** (same "themed `Input` with a `type=`/`inputMode=` preset" shape `SearchField` already establishes — cheap to add) · `Textarea` **[extract]** · `MaskInput` **[new]** · `CurrencyInput` **[new]**

### Selection
`Select`/`MultiSelect` **[extract]** (unstyled visual shell around `headless`'s `Select`/`Listbox` behavior) · `NativeSelect` **[built]** (already lives in `@nebula/primitives` as a bare atom — correctly placed there already, since it's a native `<select>` with zero custom behavior; not a `styleless`-tier item despite the name) · `SegmentedControl` **[new]** (visual variant of `headless`'s `ToggleGroup`, single-select)

### File Upload
`FileInput`/`ImageUpload` **[new]** (styled shells around `headless`'s `FileUpload` behavior) · `Dropzone` **[extract]** (today `react-ui`'s `FileUploadDropzone`)

### Form Infrastructure (the styled shell around `headless`'s `Field`)
`FormControl`/`FormLabel`/`FormDescription`/`FormMessage`/`FormError`/`FormHint` **[extract]** (today `react-ui`'s `Field`/`FieldLabel`/`FieldDescription`/`FieldError` — already exactly this, just named after `headless`'s parts directly rather than under distinct `Form*` names; recommend keeping today's naming, not renaming to `FormControl` etc., to avoid `Field`-vs-`FormControl` confusion)

### Data Display
`Avatar`/`AvatarGroup` **[extract]** · `Badge` **[extract]** · `Chip`/`Tag`/`Pill` **[extract]** (`Pill` is new — same shape as `Tag`, fully-rounded; confirm it's not just `Tag` + `rounded-full` before building a third component) · `Card`/`Surface`/`Paper` **[extract]** · `Divider` **[built]** (this is `react-ui`'s existing `Separator`, already covered — not a duplicate) · `Progress`/`CircularProgress` **[extract]** (`CircularProgress` is new — an SVG-ring variant of today's linear-only `Progress`) · `Spinner` **[extract]** · `Skeleton` **[extract]** · `Timeline` **[extract]** · `Statistic`/`Metric` **[extract]** (today `react-ui`'s `Stat`) · `EmptyState` **[new]**

### Feedback
`Alert`/`Banner`/`Callout`/`InlineMessage` **[new]** (four closely related "static message box" variants — confirm with the project owner whether these are truly 4 components or 1 component with a `variant` prop, per the same "variant vs. family" rule `BLOCKS_ARCHITECTURE.md` §5 already establishes for blocks) · `Toast`'s visual shell **[extract]** (behavior is `headless`; today's `react-ui` `Toast` already is this) · `Notification` **[new]** (likely = `Toast` + a persistent, non-auto-dismissing variant, not a fully separate component — same confirm-before-building flag)

### Navigation
`Breadcrumb` **[extract]** · `Pagination`'s visual shell **[extract]** (behavior is `headless`) · `Sidebar`/`Navbar` **[extract]** · `BottomNavigation`/`NavigationRail` **[new]** (mobile-first nav patterns, no `react-ui` counterpart yet) · `AppBar` **[new]** (likely = today's `Header`, confirm before building a duplicate) · `Stepper`'s visual shell **[extract]**

### Layout
`Header`/`Footer`/`Main`/`Section`/`Surface` **[extract]** · `Aside` **[new]** (today's `Sidebar` may already cover this — confirm before adding) · `Page` **[new]** · `Hero` — **out of scope for this layer**, it's a `react-ui-blocks` marketing block, not a domain-neutral atom (see `BLOCKS_ARCHITECTURE.md` §3.6) · `ContainerLayout` — likely redundant with `primitives`' `Container`, confirm before building

### Data
`Table`/`DataGrid` **[extract]** (today `react-ui`'s `DataTable`/`DataGrid`) · `DescriptionList`/`List`/`ListItem` **[extract]**

### Search
`SearchBar`/`SearchBox` **[new]** (likely = `SearchField` + a results-dropdown composition — confirm scope before building; a bare search input is already covered by `styleless`'s `SearchInput` above)

### Commerce — **out of scope for `styleless`/`react-ui`.**
`Price`, `ProductCard`, `QuantityInput` are domain-specific (ecommerce). Per this package's own domain-neutral rule and `BLOCKS_ARCHITECTURE.md` §0, these belong in a future `react-ui-blocks/ecommerce` subpath, not the neutral `styleless`/`react-ui` layers. `QuantityInput` is the one arguable exception (it's really just `NumberInput` with a min of 1) — recommend not building an ecommerce-flavored duplicate.

### Authentication — **these are `react-ui-blocks`, not `styleless`.**
`LoginForm` **[built, react-ui-blocks]** · `RegisterForm`/`SignupForm` **[new, react-ui-blocks]** · `PasswordStrengthIndicator` **[new]** — this one *is* legitimately `styleless`-tier (a themed meter, no page-level composition), not a block.

### Rich Content
`Markdown` **[extract]** (today already unstyled-parsing + styled-rendering combined in one `react-ui` component — could split the parser output from the themed rendering if a consumer ever needs the raw parsed structure, not needed yet) · `SyntaxHighlighter` — **not built, scope-cut** (needs a real highlighting engine dependency, same reasoning `CodeBlock`'s own doc comment documents for why it isn't one) · `CodeBlock` **[extract]** · `CopyButton` **[new]** (today inlined directly inside `CodeBlock`'s header — worth factoring out once a second consumer needs a standalone copy-to-clipboard button)

### Miscellaneous
`KbdShortcut` **[new]** (a `Kbd` sequence renderer, e.g. "⌘K") · `ThemeSwitcher` **[built, react-ui-blocks]** · `ThemeToggle` **[new]** (a simpler light/dark-only version of `ThemeSwitcher`, no "system" option — confirm it's wanted before building a near-duplicate) · `LocaleSwitcher`/`LanguageSwitcher` **[new]** (need real i18n plumbing this repo doesn't have yet — flag as a dependency, not just a UI gap)

---

## 5. `react-ui` and `react-ui-blocks`

Unchanged from today's role: `react-ui` applies the token/theme system on top of whichever `styleless` (or, for a handful of documented judgment calls above, `headless`-direct) component underlies it; `react-ui-blocks` assembles multiple `react-ui` components into full screens (`LoginForm`, `DashboardLayout`, etc. — already built; `SignupForm`/`ChartCard`/`FilterBar`/`NotificationCenter` still queued, see that package's own README).

---

## Net-new package/rename summary

- **Rename** `packages/styleless` → `packages/headless` (content unchanged, ~40 components). **Done.**
- **New package** `packages/styleless` (unstyled-but-structurally-complete versions of ~50 components currently styled directly in `react-ui`) — the single biggest chunk of net-new work in this taxonomy, marked **[extract]** throughout section 4.
- **New primitives**: roughly 25 items (`Flex`/`Grid`/`Stack`/`Inline`/`Center`/`Container`/`AspectRatio`, the `Typography`/`Media`/`Forms` atoms, most of the accessibility/positioning infrastructure).
- **New headless components**: a handful — `DateField`/`TimeField`, `PinInput` (pending the confirm-before-building flag above), `DragOverlay`, `ScrollArea`/`Splitter`/`Resizable`.
- **Scope cuts carried forward unchanged**: `SyntaxHighlighter`/`QRCode` (need real dependencies unavailable in this sandbox) — see `COMPONENT_COVERAGE_AUDIT.md`.
