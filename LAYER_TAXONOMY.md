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
`Button` **[built]** (extracted this session — `packages/styleless/src/button`; `react-ui`'s `Button` now wraps it and adds only `cva` styling) · `IconButton` **[built]** (extracted this session — wraps `styleless`'s own `Button`, adds only the required-`aria-label` type constraint; `react-ui`'s `IconButton` wraps this and adds square sizing) · `ToggleButton` **[resolved: no separate component]** — confirmed this session: `react-ui`'s `Toggle` already wraps `headless`'s `Toggle` directly (the real pressed-state behavior lives in `headless`; there's no unstyled *structural* step worth adding between them beyond what `headless`'s `Toggle` already is), so "ToggleButton" in the source list and today's `Toggle` are the same component, not two · `SplitButton` **[built]** (extracted this session — the `role="group"` structural contract only; `react-ui`'s `SplitButton` wraps it and adds the visual-merge classes) · `CloseButton` **[new, deferred]** (an icon-only dismiss button preset — `DialogClose`/`DrawerClose`/`AlertDialogCancel` all currently roll their own close-button markup inline; per this entry's own note, worth factoring out once a third+ consumer needs the identical shape — not yet, so deliberately not built this session) · `FloatingActionButton` **[built]** (extracted this session as `styleless`'s `FAB` — kept the existing `FAB` name rather than renaming, consistent with `Button`/`Toast` keeping their names across layers; `react-ui`'s `FAB` wraps it and adds circular/elevated styling)

### Inputs
`Input` **[built]** (extracted this session — a thin pass-through of `primitives`' `Input`; exists so every preset below and `react-ui`'s `Input` chain through `styleless` consistently) · `SearchInput` **[built]** (extracted this session — bare `type="search"` preset, no icon; `react-ui`'s `SearchField` wraps it and adds the icon) · `PasswordInput` **[built]** (extracted this session — the real `visible`/`type`-swap state machine, with `renderToggle`/`toggleClassName` as escape hatches for `react-ui`'s icon+positioning) · `EmailInput`/`UrlInput`/`TelInput` **[built]** (added this session — same "themed `Input` with a `type=` preset" shape `SearchInput` establishes) · `Textarea` **[built]** (extracted this session — same pass-through shape as `Input`) · `MaskInput` **[new, deferred]** · `CurrencyInput` **[new, deferred]** (both need real formatting/cursor-position logic beyond a type preset — not rushed this session; real follow-up work, not a scope cut)

### Selection
`Select`/`MultiSelect` **[resolved: skip `styleless`]** — investigated this session: `react-ui`'s current `Select`/`MultiSelect` wrappers add only Tailwind classes and decorative icons (chevron, checkmark) directly on top of `headless`'s already-complete `Select`/`Listbox` compound components, with zero non-visual structure in between worth decoupling (unlike `Button`'s real `loading` state or `PasswordInput`'s real `visible` state) — same "skip straight to react-ui" call this package's own `Toggle` already makes for the identical reason. Not built as a `styleless` component; documented here rather than silently skipped. · `NativeSelect` **[built]** (already lives in `@nebula/primitives` as a bare atom — correctly placed there already, since it's a native `<select>` with zero custom behavior; not a `styleless`-tier item despite the name) · `SegmentedControl` **[built, in `react-ui` directly]** (built this session as a visual variant of `headless`'s `ToggleGroup` with `type="single"` fixed — same "skip `styleless`" reasoning as `Select`/`MultiSelect` above, since there's no structural behavior beyond what `ToggleGroup` already provides)

### File Upload
`ImagePreview` **[built, in `styleless`]** (built this session — the one real behavior worth decoupling: `URL.createObjectURL`/`revokeObjectURL` lifecycle management for a selected `File`, unstyled) · `ImageUpload` **[built, in `react-ui` directly]** (built this session composing `headless`'s `FileUpload` + `styleless`'s new `ImagePreview` inside a themed thumbnail grid — the grid/sizing/overlay are all visual choices with nothing left to decouple once `ImagePreview` owns the real behavior, same "skip `styleless`" call as `Select`/`SegmentedControl` above) · `FileInput` **[resolved: not built]** — confirmed a near-duplicate: `FileUploadInput` (the bare `<input type="file">` part, no dropzone chrome) already covers a non-dropzone file picker · `Dropzone` **[resolved: skip `styleless`]** (today's `react-ui` `FileUploadDropzone` is pure Tailwind over `headless`'s already-complete `FileUploadDropzone` — same reasoning as `Select`/`MultiSelect` below)

### Form Infrastructure (the styled shell around `headless`'s `Field`)
`FormControl`/`FormLabel`/`FormDescription`/`FormMessage`/`FormError`/`FormHint` **[resolved: skip `styleless`]** — investigated this session: today's `react-ui` `Field`/`FieldLabel`/`FieldDescription`/`FieldError` add only a flex layout and text-color/size classes on top of `headless`'s already-complete `Field` compound, no structural behavior of their own to decouple (same reasoning as `Select`/`MultiSelect`'s resolution above). Keeping today's naming either way, per this entry's own original recommendation — not renaming to `FormControl` etc.

### Data Display
`Avatar`/`AvatarGroup` **[built, in `styleless`]** (built this session — the real behavior worth decoupling: `Avatar`'s image-load/error tracking + `AvatarFallback`'s `delayMs` timer, and `AvatarGroup`'s `max`-truncation/overflow-count math; none of these carry a WAI-ARIA widget role the way `Progress`/`Spinner`/`Skeleton` do, so they landed in `styleless` rather than `headless`, same bucket `PasswordInput`'s visibility toggle and `ImagePreview`'s object-URL lifecycle already live in. `AvatarGroup` takes a `renderOverflow` render prop — same escape hatch `PasswordInput`'s `renderToggle` uses — so `react-ui`'s styled `Avatar`/`AvatarFallback` can be injected for the `+N` badge instead of styleless's unstyled default) · `Badge` **[resolved: skip `styleless`]** (pure `cva`/Tailwind variant recipe over `Primitive`, no state to decouple) · `Chip` **[resolved: skip `styleless`]** (the dismiss button is fully controlled — `onDismiss` is a caller-supplied callback, `Chip` holds no internal state of its own to extract, unlike `PasswordInput`'s self-owned `visible` state) · `Tag` **[resolved: skip `styleless`]** (an outlined `cva` twin of `Badge`, same reasoning) · `Pill` **[resolved: not built]** — investigated this session: `Chip` without `onDismiss` already renders as a fully-rounded, non-dismissible pill (`chipVariants`' base classes are `rounded-full`), so a separate `Pill` component would be a duplicate; reach for `<Chip variant="neutral">` with no `onDismiss` instead · `Card`/`Surface`/`Paper` **[resolved: skip `styleless`, already built]** (all three are already thin `cn()`-over-`Primitive` wrappers with zero behavior, same treatment their own doc comments already document — no `styleless` counterpart needed, same as `Timeline`/`Stat` below) · `Divider` **[built]** (this is `react-ui`'s existing `Separator`, already covered — not a duplicate) · `Progress` **[resolved: skip `styleless`, already built]** (already wraps `@nebula/headless`'s `Progress`/`ProgressIndicator` directly — the ARIA `role="progressbar"` pattern lives in `headless`, not `styleless`, same as `Spinner`/`Skeleton`) · `CircularProgress` **[built, in `react-ui` directly]** (built this session as an SVG-ring visual variant of the same `headless` `Progress` — no new behavior, only a different geometry applied to `Progress`'s existing value/percent math, same "skip straight to react-ui" call `SegmentedControl` makes for `ToggleGroup`) · `Spinner` **[resolved: skip `styleless`, already built]** (wraps `headless`'s `Spinner`, same ARIA-lives-in-headless reasoning) · `Skeleton` **[resolved: skip `styleless`, already built]** (wraps `headless`'s `Skeleton`, same reasoning) · `Timeline` **[resolved: skip `styleless`]** (purely presentational structure, no state, already self-documented as having no lower-layer compound — `TimelineItem`'s dot/line are static markup, nothing to decouple) · `Statistic`/`Metric` **[resolved: skip `styleless`]** (today's `react-ui` `Stat` — purely presentational structure, same reasoning as `Timeline`) · `EmptyState` **[built, in `react-ui` directly]** (built this session — `EmptyState`/`EmptyStateIcon`/`EmptyStateTitle`/`EmptyStateDescription`/`EmptyStateAction` are a themed column with no behavior of their own, same "skip straight to react-ui" call `Card`/`Stat`/`Timeline` all make)

### Feedback
`Alert`/`Banner`/`Callout`/`InlineMessage` **[resolved: built as one component]** — resolved as one `Alert` component with `variant`/`color` axes (the same two-axis pattern `Button`/`Badge` already establish), not four; `Banner`/`Callout`/`InlineMessage` are all the same "static message box" shape at different widths/weights, which `className`/`variant` already covers without a second implementation. Built directly in `react-ui` (no `headless`/`styleless` layer — `onDismiss` is fully controlled, no internal state to decouple, same reasoning `Chip` already documents) · `Toast`'s visual shell **[resolved: skip `styleless`]** — inspected on this pass: every one of `Toast`/`ToastViewport`/`ToastTitle`/`ToastDescription`/`ToastAction`/`ToastClose` in `react-ui` is `HeadlessX` + `cn(tailwind, className)` on the identical DOM shape `headless`'s already-complete `Toast` provides (the auto-dismiss timer, pause-on-hover, and `role="status"`/`aria-live` all live in `headless`, not here) — same "skip styleless" shape already resolved for `Select`/`MultiSelect`/`Field` · `Notification` **[resolved: not built]** — `react-ui-blocks`' `NotificationCenter` (a full inbox) and `SaasAppHeader`'s own bell panel already cover the "persistent notification" need at the blocks layer; a `styleless`/`react-ui`-tier `Notification` would have nothing real left to compose

### Navigation
`Breadcrumb` **[resolved: skip `styleless`]** — inspected: `breadcrumb.tsx` is a bare re-export, every other part is `HeadlessX` + `cn()` (plus a default-chevron-icon fallback when no `children` given, the same non-structural fallback pattern `FileUploadRemoveTrigger`'s default "×" already uses) — nothing to decouple · `Pagination`'s visual shell **[resolved: skip `styleless`]** — inspected: same pure-`cn()` shape, and `usePaginationRange` already lives in `@nebula/headless` with its own test file; `react-ui`'s `pagination.tsx` only re-exports it · `Sidebar`/`Navbar` **[resolved: skip `styleless`]** — see Layout row below, same reasoning · `BottomNavigation`/`NavigationRail` **[partially resolved]** — `BottomNavigation` is already covered by `react-ui`'s existing `BottomNav`/`BottomNavItem` (a mobile-only fixed tab bar, built this session); `NavigationRail` (a desktop vertical icon rail) has no current consumer anywhere in this repo, stays deferred rather than built speculatively · `AppBar` **[resolved: not built]** — confirmed a duplicate of today's `Header` · `Stepper`'s visual shell **[resolved: skip `styleless`]** — inspected: `stepper.tsx` is a bare re-export, every other part (`list`/`item`/`trigger`/`indicator`/`title`/`description`/`separator`) is `HeadlessX` + `cn()`, no new state/DOM

### Layout
`Header`/`Footer`/`Main`/`Section`/`Surface` **[resolved: skip `styleless`]** — inspected: all five are thin `Primitive as="..."` + `cn(tailwind, className)` wrappers with no `useState`/context/sub-components and, per their own doc comments, no matching `headless` compound to have decoupled anything from in the first place — there is no hidden structure to pull out, these are already at their simplest form · `Aside` **[resolved: not built]** — confirmed a duplicate of today's `Sidebar` (inspected alongside `Navbar` above: `Sidebar`'s only extra prop, `side`, is a pure className computation, not structural state — same "nothing to extract" conclusion) · `Page` **[resolved: not built]** — `react-ui-blocks`' `PageSection`/`AppLayout`/`DashboardLayout` already cover page-level shell composition; a domain-neutral atoms/molecules layer isn't the right place for a full-page wrapper · `Hero` — **out of scope for this layer**, it's a `react-ui-blocks` marketing block, not a domain-neutral atom (see `BLOCKS_ARCHITECTURE.md` §3.6) · `ContainerLayout` **[resolved: not built]** — confirmed redundant with `primitives`' `Container`

### Data
`Table`/`DataGrid` **[extracted]** (today `react-ui`'s `DataTable`/`DataGrid`) — both had real structure worth decoupling (`DataTable`: `useControllableState` ×3 for sort/selection state, a `DataTableContext`, a real sort-toggle `<button>` computing `aria-sort`, checkbox selection with indeterminate "some selected" math; `DataGrid`: `@nebula/hooks`' `useVirtualizer`, the WAI-ARIA Grid pattern built from scratch on plain `div`s, absolute-position math) — these were two structurally different pieces (a stateful table vs. a self-contained virtualized grid) bundled under one taxonomy bullet, built as two separate `styleless` components, not one. Both now live in `@nebula/styleless` (`data-table`, `data-grid`), with `react-ui` reduced to thin themed wrappers supplying `classNames`. `DataGrid`'s absolute-position/transform math (functionally required for virtualization, not a visual choice) is baked into the `styleless` layer's own inline style; `display: flex` on the row/header/cell parts is left to `react-ui`'s `classNames` since it's a decorative layout choice, not a structural requirement. · `DescriptionList`/`List`/`ListItem` **[resolved: skip `styleless`]** — inspected: both are plain `Primitive` + `cn()` wrappers (`List`'s only extra prop, `ordered`, just picks `ol` vs `ul`), no state, no headless compound to decouple from — same "already at simplest form" conclusion as the Layout row above

### Search
`SearchBar`/`SearchBox` **[resolved: not built]** — would functionally duplicate the already-complete `Combobox` (open/close results list + keyboard nav is exactly what `Combobox`'s `headless` layer already provides); a bare search input is already covered by `styleless`'s `SearchInput` above, and nothing in this repo currently needs a third variant between the two — stays deferred rather than built speculatively

### Commerce — **out of scope for `styleless`/`react-ui`.**
`Price`, `ProductCard`, `QuantityInput` are domain-specific (ecommerce). Per this package's own domain-neutral rule and `BLOCKS_ARCHITECTURE.md` §0, these belong in a future `react-ui-blocks/ecommerce` subpath, not the neutral `styleless`/`react-ui` layers. `QuantityInput` is the one arguable exception (it's really just `NumberInput` with a min of 1) — recommend not building an ecommerce-flavored duplicate.

### Authentication — **these are `react-ui-blocks`, not `styleless`.**
`LoginForm` **[built, react-ui-blocks]** · `RegisterForm`/`SignupForm` **[new, react-ui-blocks]** · `PasswordStrengthIndicator` **[new]** — this one *is* legitimately `styleless`-tier (a themed meter, no page-level composition), not a block.

### Rich Content
`Markdown` **[resolved: not built]** — still no consumer needs the raw parsed structure independently of the themed rendering, per this entry's own original note; not revisited this pass · `SyntaxHighlighter` — **not built, scope-cut** (needs a real highlighting engine dependency, same reasoning `CodeBlock`'s own doc comment documents for why it isn't one) · `CodeBlock` **[extract, confirmed]** — inspected: real local state (`copied`, reset via `window.setTimeout`), a real async behavior (`navigator.clipboard.writeText` with a try/catch for denied access), a computed value (`code.split('\n')`), and new DOM (the language-label+copy-button header row, conditional line-number table) — genuinely worth pulling into `styleless`, the clearest "extract" case in this whole section · `CopyButton` **[resolved: not built]** — still only one consumer (`CodeBlock`'s own header); stays inlined rather than factored out speculatively, per this entry's own original note

### Miscellaneous
`KbdShortcut` **[resolved: built directly in `react-ui`]** (a `Kbd` sequence renderer, e.g. "⌘K" — purely presentational, same "skip `styleless`" treatment `Kbd` itself already has) · `ThemeSwitcher` **[built, `react-ui`]** — moved from `react-ui-blocks` this session: its own doc comment already self-described as domain-neutral, which is exactly the bar that belongs in `react-ui`, not the organisms-only `react-ui-blocks` layer; also grew a third `variant="dropdown"` (single icon-button trigger, opens a Light/Dark/System menu) · `ThemeToggle` **[resolved: not built]** — confirmed a near-duplicate of `ThemeSwitcher`'s existing `variant="icon"`/`"dropdown"` shapes, not worth a second component · `LocaleSwitcher`/`LanguageSwitcher` **[new]** (need real i18n plumbing this repo doesn't have yet — flag as a dependency, not just a UI gap)

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
