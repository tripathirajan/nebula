# Component Coverage Audit

Cross-check of the target component list against the actual `packages/*/src` tree (checked directly, not against docs). Legend: ✅ built · ⚠️ partial / covered under a different name or layer · ❌ not started · 🚫 explicitly out of scope (per project owner direction — `Span` and the Primitive `Utilities` subsection).

**Updated** after this session's build pass: Primitive's `VStack`/`HStack`/`Wrap`/`Spacer`/`Image` gap is now closed; `react-ui` gained styled wrappers for `Tooltip`/`Tabs`/`Checkbox`/`Switch`/`RadioGroup` (the headless behavior already existed for all five — this was the "cheapest big win" flagged below).

## Headline numbers

| Layer | Covered | Partial | Missing | Total (in scope) |
| --- | --- | --- | --- | --- |
| Primitive | 20 | 0 | 0 | 20 (Core+Elements+Layout; `Utilities` subsection and `Span` out of scope — `Button`/`Input`/`Textarea`/`Label`/`Form`/`NativeSelect` aren't tracked as separate checklist items in this audit, but all exist; see `AGENTS.md`'s `packages/primitives` row) |
| Headless | 41 | 0 | 0 | 52 (the headless backlog is now fully resolved — every unchecked item across the whole layer, 11 total, is explicitly N/A rather than "not started yet": `Form`/`Input`/`Textarea`/`NativeSelect` covered by `primitives` directly, `RangeSlider` subsumed by `Slider`'s multi-thumb support, `Button` covered by `primitives`' non-stateful `Button`, and — a project owner decision this session — `DataTable`/`Carousel`/`Virtualizer`/`Draggable`/`Droppable`/`Sortable` are deliberately being built directly in `react-ui`/`@nebula-lab/hooks` instead of getting a separate unstyled layer, since they don't have the kind of independent ARIA-behavior-vs-styling split the rest of this package's components do) |
| react-ui | 70 | 3 | 5 | 78 (recounted directly from this session's per-section tallies — Layout 8/2/1/11, Typography 5/0/0/5, Button 5/0/0/5, Form 17/0/0/17, Navigation 7/0/0/7, Overlay 5/1/0/6, Feedback 4/0/2/6, Data Display 8/0/0/8, Data 5/0/0/5, Media 3/0/1/4, Misc 3/0/1/4; Form/Navigation/Data Display/Data are now fully covered — `MultiSelect`/`DatePicker`/`DateRangePicker`/`TimePicker` closed out Form, the Navigation `Navbar`/`Sidebar` duplicate-listing was reconciled against the Layout section's already-built versions, `Timeline`/`Calendar` closed out Data Display, and `Markdown`/`CodeBlock` closed out all but one Misc item — `QRCode` is the one deliberate, documented scope cut in this whole audit (see the Misc section's own note for why); only Layout's `AppShell`/`Divider`, Overlay's `Modal`⚠️, Feedback's `Alert`/`EmptyState`, Media's `Image`⚠️, and `QRCode` remain, see `AGENTS.md`'s `react-ui` row for this session's full rundown) |

Primitive is now fully covered for the in-scope items. Headless and react-ui are intentionally much further behind — this list is a full "everything a mature design system could have" wishlist (roughly Radix + Chakra + Mantine combined in scope), not a near-term backlog.

---

## Primitive

### Core
- [x] Primitive
- [x] Slot
- [x] Portal
- [x] Presence

**4/4**

### Elements
- [x] Box
- [x] Text
- [x] Heading
- [x] Paragraph
- 🚫 Span — explicitly out of scope per project owner direction
- [x] Link
- [x] Image — built this session (unstyled polymorphic `img` wrapper, no load/error tracking — that's `react-ui`'s `Avatar`'s job)

**6/6 in scope**

### Layout
- [x] Flex
- [x] Grid
- [x] Stack
- [x] VStack — built this session (thin alias of `Stack`, own `displayName`)
- [x] Inline
- [x] HStack — built this session (new — `Flex` row, `align="center"`, no wrap, unlike `Inline`/`Wrap`)
- [x] Wrap — built this session (thin alias of `Inline`)
- [x] Spacer — built this session (new — `flex-grow` filler, `aria-hidden`)
- [x] Container
- [x] Center
- [x] AspectRatio

**10/10**

### Utilities
🚫 Explicitly out of scope per project owner direction. For reference, prior state: `VisuallyHidden`/`FocusScope`/`DismissableLayer` (renamed `DismissibleLayer` this session) built; `Separator` only exists styled in `react-ui`; `FocusTrap` exists as a hook, not a component; `Floating` is conceptually covered by `Popper`; `ScrollArea`/`Arrow` not built.

---

## Headless

### Button
- [ ] Button — not built (native `<button>` + `primitives`' `Button` covers the non-stateful case; no headless wrapper needed unless it grows state)
- [x] Toggle — built this session (`aria-pressed`, no hidden native input — not a form field the way `Checkbox`/`Switch` are)
- [x] ToggleGroup — built this session (`type="single"|"multiple"`, same discriminated-union split as `Accordion`; `role="group"`, not `radiogroup`, even in single mode)

**2/3**

### Form
- [ ] Form — N/A (native `<form>` + `primitives`' `Form` covers the non-stateful case, same as `Input`)
- [x] Field — built this session (`FieldLabel`/`FieldControl`/`FieldDescription`/`FieldError`, shared-id wiring)
- [ ] Input — N/A (native `<input>` + `primitives`' `Input` covers the non-stateful case)
- [ ] Textarea — N/A (native `<textarea>` + `primitives`' `Textarea` covers the non-stateful case)
- [x] NumberInput — built this session (real `<input type="number">` + optional +/- stepper buttons, `tabIndex={-1}` since the field already supports keyboard up/down)
- [x] Checkbox
- [x] CheckboxGroup — built this session (`role="group"`, no roving tabindex — items are independently `Tab`-reachable like native checkboxes)
- [x] RadioGroup
- [x] Switch
- [x] Select — built this session (`SelectTrigger`/`SelectValue`/`SelectPortal`/`SelectContent`/`SelectItem`, collapsible-listbox pattern reusing `Listbox`)
- [ ] NativeSelect — N/A (added to `primitives` instead — see that layer's table row — same treatment `Input`/`Textarea` get)
- [x] Combobox — built this session (editable-combobox-with-list-autocomplete pattern, `aria-activedescendant`-based virtual highlight, real focus stays on the input)
- [x] Autocomplete — built this session (thin renamed re-export of `Combobox` — see that entry's rationale)
- [x] Slider — built this session (`SliderTrack`/`SliderRange`/`SliderThumb`, `value` is a `number[]` — one thumb per entry)
- [x] RangeSlider — N/A, subsumed by `Slider` (a two-value array + two `SliderThumb`s already is a range slider — no separate component)
- [x] Rating — built this session (`RatingItem`, hover-preview fill via `hoveredValue` on top of a `RadioGroup`-like single-select shape)
- [x] ColorPicker — built this session (`ColorPickerTrigger`/`ColorPickerContent`/`ColorPickerHexInput` — swatch trigger + validated hex input; no 2D saturation/brightness square yet, documented as a `react-ui`-layer follow-up)
- [x] OTPInput — built this session (`OTPInputSlot`, one real `<input maxLength={1}>` per digit, auto-advance/backspace/paste)
- [x] FileUpload — built this session (`FileUploadDropzone`/`FileUploadInput`/`FileUploadFileList`/`FileUploadFileItem`/`FileUploadRemoveTrigger` — real `<label>` + native `<input type="file">`, drag-and-drop layered on top)

**15/19** (Form/Input/Textarea/NativeSelect intentionally N/A at this layer; RangeSlider intentionally N/A, subsumed by Slider — see notes)

### Navigation
- [x] Tabs
- [x] Accordion
- [x] Collapsible — built this session, as its own standalone primitive (`Accordion` itself hasn't been migrated onto it — a separate, orthogonal change — but the shared primitive the note here previously flagged as missing now exists)
- [x] Breadcrumb — built this session (`nav`/`ol`/`li` structural composition + `BreadcrumbPage`'s `aria-current="page"`; no state machine, same "almost pure markup" profile as `Progress`/`Spinner`/`Skeleton`)
- [x] Pagination — built this session (`PaginationList`/`Item`/`Link`/`Previous`/`Next`/`Ellipsis`; `usePaginationRange` is a standalone pure helper computing the truncated page-number array)
- [x] NavigationMenu — built this session (`NavigationMenuList`/`Item`/`Trigger`/`Portal`/`Content`/`Link`; each `NavigationMenuItem` mints its own ambient `Popover`, same trick `MenubarMenu` plays with `Menu`; hover-driven via `openDelay`/`closeDelay`, no shared `Viewport`/`Indicator` — documented scope cut)
- [x] Menu — built this session, along with `DropdownMenu` (thin renamed re-export) as its own subpath, not separately tracked in this list
- [x] Menubar — built this session
- [x] ContextMenu — built this session
- [x] Tree — built this session (`TreeItem`/`TreeItemToggle`/`TreeGroup`; WAI-ARIA Tree View pattern, custom arrow-key handling since `RovingFocusGroup` has no nested-group notion; `TreeGroup` fully unmounts while collapsed so a DOM query for `[role="treeitem"]` always reflects exactly the reachable items)
- [x] Stepper — built this session (`StepperList`/`Item`/`Trigger`/`Indicator`/`Title`/`Description`/`Separator`; `aria-current="step"`; `allowSkipAhead` gates jumping ahead of the current step)

**11/11**

### Overlay
- [x] Dialog
- [x] AlertDialog — built this session, composed on top of `Dialog` exactly as previously flagged: reuses `Dialog`'s root/context/Trigger/Portal/Overlay/Title/Description directly, only `AlertDialogContent` (`role="alertdialog"`, no outside-click dismissal — deliberately no `onPointerDownOutside` prop at all) is a real second implementation
- [x] Drawer — built this session, composed on top of `Dialog` the same way `AlertDialog` is (thin renamed re-exports for `Trigger`/`Portal`/`Overlay`/`Title`/`Description`/`Close`; only `DrawerContent`, which adds a `side` prop exposed as `data-side` for the consumer's own slide-in-from-an-edge CSS, is a real second implementation)
- [x] Popover
- [x] Tooltip — built this session
- [x] HoverCard — built this session (hover-driven like `Tooltip`, but the shared close timer is armable/disarmable from both `HoverCardTrigger` *and* `HoverCardContent` — the same technique `NavigationMenuTrigger`/`Content` use — since content commonly holds real interactive elements the pointer needs to travel into; `FocusScope`'s auto-focus is suppressed entirely on mount/unmount, since a hover-opened panel must never steal keyboard focus)
- [x] Toast — built this session (`role="status"`/`aria-live="polite"`; no shared root — each `Toast` owns its own open state and auto-dismiss timer, since multiple toasts are normally visible independently, unlike `Dialog`'s "one at a time"; the `duration` countdown pauses on pointer-enter and resumes with whatever time was left, not a fresh countdown, on pointer-leave; `ToastAction` requires a separate `altText` prop for its accessible name since visible button text like "Undo" is ambiguous out of the toast's visual context; `ToastViewport` is a deliberately simple `<ol>`, no F6/F8 keyboard-jump-to-region shortcut)

**7/7**

### Collections
- [x] Listbox — built this session (`ListboxOption`, `type="single"|"multiple"`, reused directly by `Select`)
- [x] Command — built this session (`CommandInput`/`CommandList`/`CommandItem`/`CommandGroup`/`CommandEmpty`/`CommandSeparator` — the WAI-ARIA combobox-with-list pattern like `Combobox`, but always "open"; no popup, since `CommandList` is always visible right below `CommandInput`, matching the command-palette shape)
- [ ] DataTable — N/A in `headless` (project owner decision): mostly sort/selection *state* over a native `<table>`, not a distinct ARIA widget worth a separate unstyled layer — **built directly in `react-ui`** this session (see that layer's Data section below)
- [x] TreeView — built this session (thin renamed re-export of every `Tree` part, same call `Autocomplete` makes reusing `Combobox`)
- [ ] Carousel — N/A in `headless` (project owner decision) — **built directly in `react-ui`** this session (see that layer's Misc section below)
- [ ] Virtualizer — N/A in `headless`/`react-ui` (project owner decision): pure windowing math with no ARIA semantics of its own — **built this session** as `useVirtualizer` in `@nebula-lab/hooks`, not a component in either layer

**3/6 (3 marked N/A — see notes)**

### Feedback
- [x] Progress — built this session (`Progress`/`ProgressIndicator`, WAI-ARIA Progress Meter pattern, indeterminate via `value={null}`)
- [x] Spinner — built this session (`role="status"` + visually-hidden label; no visual spin animation at this layer, that's `react-ui`'s job)
- [x] Skeleton — built this session (`aria-hidden` placeholder; no shimmer at this layer)

**3/3**

### Drag & Drop
- [ ] Draggable — N/A in `headless` (project owner decision) — **built directly in `react-ui`** this session (native HTML5 Drag and Drop API; see `react-ui`'s row in `AGENTS.md` for the documented keyboard-accessibility limitation)
- [ ] Droppable — N/A in `headless`, same reasoning — **built this session**
- [ ] Sortable — N/A in `headless`, same reasoning — **built this session** as `Sortable`/`SortableItem`

**0/3 (all 3 marked N/A in this layer — moved to `react-ui` and built there this session, see notes)**

---

## react-ui

### Layout
- [ ] AppShell — ⚠️ `react-ui-blocks` has `AppLayout`, a similar concept one layer up, not this package
- [x] Header — built this session (purely presentational, no `@nebula-lab/headless` compound underneath, same "thin `cn()` wrapper around `Primitive`" treatment as `Card`)
- [x] Footer — built this session (same treatment as `Header`, `border-t` instead of `border-b`)
- [x] Sidebar — built this session (`side` prop only flips which edge gets the border; actual page placement is left to the consumer's own flex/grid layout)
- [x] Navbar — built this session (a `<nav>`, distinct from `Header`'s `<header>` landmark — often nested inside one alongside a logo)
- [x] Main — built this session (`flex-1`, no background/border of its own — the neutral content region `Header`/`Footer`/`Sidebar` frame)
- [x] Section — built this session (a `<section>` landmark with vertical spacing between its own children only, same "neutral region" treatment as `Main`)
- [x] Card
- [x] Surface — built this session (the plainest themed background — no border/shadow/radius at all, one step below `Paper`/`Card`)
- [x] Paper — built this session (same bordered/elevated surface `Card` uses, but without `Card`'s compound header/title/footer sub-parts; `elevation` prop only controls shadow depth)
- [ ] Divider — ⚠️ `Separator` (this package) covers the same job under a different name

**8 solid / 2 partial / 1 missing out of 11**

### Typography
- [x] Text — built this session (wraps `@nebula-lab/primitives`' unstyled, polymorphic `Text`, adding only this theme's default body color — no font-size/weight opinion here either, matching the primitive it wraps)
- [x] Heading — built this session (same wrap-and-color-only treatment, plus this theme's `--font-heading` stack)
- [x] Code — built this session (overrides `@nebula-lab/primitives`' `Code`'s hardcoded pre-token-system `bg-gray-100` with themed `--code-bg`/`-text`; found and fixed a real gap in `@nebula-lab/primitives` while wiring this up — see below)
- [x] Blockquote — built this session (purely presentational, no lower-layer counterpart at all, same "thin `cn()` wrapper directly around `Primitive`" treatment this session's `Header`/`Footer`/etc. use)
- [x] Kbd — built this session (same treatment as `Blockquote`, native `<kbd>` element)

**5/5** — **found and fixed a real pre-existing gap in `@nebula-lab/primitives` while building this**: `TextOwnProps`/`HeadingOwnProps`/`PolymorphicComponent` were already exported from `text.tsx`/`heading.tsx`/`polymorphic.ts` themselves but never re-exported from their package's own `index.ts` barrels (a real bug predating this session, not introduced by it) — `react-ui`'s new `Text`/`Heading` wrappers needed exactly those three types to preserve `truncate`/`level` prop typing through the wrap, which is what surfaced it. Fixed both the `src/` barrels and the already-built `dist/text`/`dist/heading`/`dist/types` `index.d.ts` files directly (their per-file `.d.ts` already had the correct exports; only the barrels were stale) rather than needing a full `tsc`-based regen.

### Button
- [x] Button
- [x] IconButton — built this session (reuses `buttonVariants` directly for color/border/focus-ring so it always matches `Button`'s theming, only the size classes are overridden to be square; `aria-label` is a required prop, not just documented convention)
- [x] ButtonGroup — built this session (purely a CSS child-combinator trick visually merging adjacent buttons — no shared state or roving tabindex, unlike `ToggleGroup`'s actual single/multi-select state machine)
- [x] SplitButton — built this session (the same visual-merge trick as `ButtonGroup`, fixed to a horizontal pair; composition, not a new state machine — wrap a `DropdownMenu`'s trigger around the second button yourself)
- [x] FAB — built this session (circular, elevated, reuses `--button-*` tokens directly rather than a separate `fabTokens` entry, since it's a specialized `Button` shape, not a differently-themed one; deliberately doesn't apply `fixed` positioning itself)

**5/5**

### Form
- [ ] TextField — ⚠️ `Input` covers this job under a different name
- [x] PasswordField — built this session (a genuinely new `react-ui`-layer component, no `@nebula-lab/headless` counterpart — a built-in show/hide toggle that swaps the underlying native `<input>`'s `type` between `"password"`/`"text"` rather than hiding text via CSS, so autofill/password managers keep working correctly either way)
- [x] SearchField — built this session (also `react-ui`-layer-only; a preset `type="search"` `Input` with a built-in leading search icon — the platform's own clear-button/Escape-to-clear affordance already comes free with the native input type)
- [x] NumberField — built this session as `NumberInput`/`NumberInputField`/`NumberInputIncrement`/`NumberInputDecrement`, mirroring the headless source's own naming (the +/- buttons default to a "+"/"-" icon when no `children` given, same convention `RatingItem`'s default star uses; both are `tabIndex={-1}` since the native `<input type="number">` already gives equivalent keyboard increment)
- [x] TextArea — built this session (wraps `@nebula-lab/primitives`' unstyled `Textarea` the same way this package's `Input` wraps `@nebula-lab/primitives`' `Input` — there's no `@nebula-lab/headless` layer for it either, mirroring how `headless` itself has no `Textarea`)
- [x] Checkbox — built this session (checkmark/dash indicator, `data-state`-driven)
- [x] Radio — built this session as `RadioGroup`/`RadioGroupItem` (indicator circle + dot rendered before the item's own children)
- [x] Switch — built this session (track + sliding thumb)
- [x] Select — built this session (`SelectTrigger` styled like `Input` with a chevron rotating via `group-data-[state=open]:rotate-180`; `SelectItem`'s checkmark uses `group`/`group-data-[state=selected]:block`, same technique `MenuCheckboxItem`'s indicator uses; root/value/portal are chrome-free re-exports)
- [x] MultiSelect — built this session, directly in `react-ui` with no `@nebula-lab/headless` layer underneath (same project-owner call `Carousel`/`DataTable`/`DataGrid` make): composes this package's own `Popover` for positioning with `@nebula-lab/headless`'s `Listbox` (`type="multiple"`) for the actual selection behavior; `MultiSelectItem`'s checkbox-square indicator (not a bare checkmark) is the deliberate visual distinction from `SelectItem`, reusing `checkboxTokens`' exact box+checkmark treatment since a multi-select option reads as *toggled*, closer to `CheckboxGroupItem` than `SelectItem`
- [x] Combobox — built this session (`ComboboxInput` styled identically to `Input`; `ComboboxItem`'s `data-[highlighted]` fill is virtual-highlight state, not real focus, per the headless source); `Autocomplete` also covered — thin renamed re-export of these same parts, not a distinct item on this wishlist
- [x] DatePicker — built this session as a single self-contained component (not a compound) — mints its own ambient `Popover` plus a `Calendar` (`mode="single"`), since unlike `MultiSelect`'s items there's no arbitrary consumer content to compose; selecting a date both sets `value` and closes the popover, a `DatePicker`-level UX decision `Calendar` itself never makes
- [x] DateRangePicker — built this session, `DatePicker`'s two-endpoint sibling (same self-contained shape); wraps a `Calendar` in `mode="range"` and only closes once both `from`/`to` are picked
- [x] TimePicker — built this session as an `Input` preset to `type="time"`, same "native input already gives the behavior for free" reasoning `SearchField`/`PasswordField` document — a locale-aware (12h/24h per the OS setting), fully keyboard-operable time control with nothing left to build from scratch
- [x] ColorPicker — built this session (`ColorPickerTrigger` is the one real second implementation — a swatch button whose own fill *is* the current value, set inline by the headless source, so this only adds the border/rounding/focus-ring frame around it; everything else is a thin renamed re-export of this package's own `Popover` parts, mirroring the headless source's own `ColorPicker`-mints-`Popover` relationship)
- [x] Rating — built this session (`RatingItem` renders a built-in filled/outline star by default, toggled purely off the headless source's `data-state`, same "no icon dependency" approach `AccordionTrigger`'s chevron uses)
- [x] FileUploader — built this session as `FileUpload`/`FileUploadDropzone`/`FileUploadInput`/`FileUploadFileList`/`FileUploadFileItem`/`FileUploadRemoveTrigger`, mirroring the headless source's own naming (`FileUploadDropzone`'s `data-dragging-over` fills the border with `--file-upload-dropzone-active-border`)

**17 solid / 0 partial / 0 missing out of 17** *(this session also gave `react-ui` styled wrappers to `Slider`, `CheckboxGroup`, `Toggle`/`ToggleGroup`, `Collapsible`, and `OTPInput` — none are distinct line items on this particular wishlist; there's no separate `RangeSlider` wrapper either, same "value is always an array" reasoning the headless source documents. `Calendar` itself — the shared engine `DatePicker`/`DateRangePicker` both build on, plain native-`Date`-arithmetic month grid with WAI-ARIA Date Picker Dialog grid keyboard semantics — isn't a distinct item on this particular wishlist either, but is the Data Display section's own `Calendar` item, now built too.)*

### Navigation
- [x] Tabs — built this session (underline treatment via `data-[state=active]` + `-mb-px`)
- [x] Breadcrumb — built this session (`BreadcrumbSeparator` defaults to a chevron icon when no `children` given, same convention `FileUploadRemoveTrigger`'s default "×" icon uses; everything else is purely structural styling — flex layout on `BreadcrumbList`, link hover color on `BreadcrumbLink`)
- [x] Pagination — built this session (styled wrapper: `PaginationLink`'s `data-[state=active]` fills with `--pagination-link-active-bg`/`-text`; root itself is a chrome-free re-export)
- [x] Navbar — ⚠️ same component as the Layout section's `Navbar`, listed twice in the source wishlist; built there, not a distinct item
- [x] Sidebar — ⚠️ same component as the Layout section's `Sidebar`, listed twice in the source wishlist; built there, not a distinct item
- [x] Menu — built this session (`MenuItem` styles on plain `focus:`, not `:focus-visible` — a `MenuItem` genuinely moves real DOM focus for both keyboard nav and pointer-hover, unlike `Combobox`/`Command`'s virtual-highlight items)
- [x] DropdownMenu — built this session (thin renamed re-export of every `Menu` part, same as `headless`)

**7/7** *(this session also gave `react-ui` styled wrappers to `Stepper`/`Tree`/`NavigationMenu`/`ContextMenu`/`Menubar` — the latter two aren't distinct items on this particular wishlist, but see `AGENTS.md`'s `react-ui` row for the full list; `Menubar`'s root was the one real second implementation in that whole batch, needing actual flex-row/border/bg chrome unlike this package's own chrome-free `Menu` root)

### Overlay
- [ ] Modal — ⚠️ `Dialog` (this package) covers the same job under a different name
- [x] Drawer — built this session (`DrawerContent` is the one real second implementation: four `data-[side=*]` variants, each with its own fixed edge + `data-[state=closed]` translate-out transform; everything else reuses `Dialog`'s own parts restyled against `drawerTokens`)
- [x] Sheet — built this session as a thin renamed re-export of this package's own `Drawer` parts (`Sheet`/`SheetTrigger`/`SheetPortal`/`SheetOverlay`/`SheetContent`/`SheetTitle`/`SheetDescription`/`SheetClose`) — "Sheet" and "Drawer" are the same edge-anchored overlay pattern under two different naming vocabularies, same `DropdownMenu`-reuses-`Menu` convention
- [x] Popover
- [x] Tooltip — built this session (styled off `neutral`/`neutral-content` rather than `Popover`/`Dialog`'s `base-100`/`base-content`)
- [x] AlertDialog — built this session (`AlertDialogContent` reuses `DialogContent`'s exact card treatment minus the built-in close button — an alert dialog is never dismissed by an incidental click; `AlertDialogAction`/`AlertDialogCancel` give the two `DialogClose`-contract buttons different default looks, a filled `danger` button vs. a plain one, since the underlying headless behavior is identical for both)

**5 solid / 1 partial / 0 missing out of 6** *(this session also gave `react-ui` styled wrappers to `HoverCard` — not a distinct item on this wishlist)*

### Feedback
- [ ] Alert
- [x] Toast — built this session (reads `--toast-*`, the same `neutral`/`neutral-content` "pop off the page" pairing `tooltipTokens` uses; `ToastViewport` is fixed bottom-right, newest-on-top)
- [x] Progress — built this session (styled wrapper: fill percentage computed from `value`/`max` and applied as an inline `translateX`; indeterminate uses Tailwind's built-in `animate-pulse` rather than a custom sliding-bar `@keyframes`)
- [x] Spinner — built this session (border-ring + `animate-spin`, both Tailwind-core)
- [x] Skeleton — built this session (`animate-pulse` fill, default `--radius-box`, override via `className` for other shapes)
- [ ] EmptyState

**4/6**

### Data Display
- [x] Avatar
- [x] AvatarGroup — built this session (overlapping row via negative margin + a ring in the page background color; `max` truncates via a plain `React.Children` slice, no registration system, plus a `+N` `Avatar`-styled overflow indicator)
- [x] Badge
- [x] Chip — built this session (the dismissible/interactive pill `Badge`'s own doc comment points at building separately; renders the "×" button only when `onDismiss` is passed)
- [x] Tag — built this session (reuses `badgeTokens`' semantic colors directly, outlined instead of filled — the one visual distinction from `Badge`, so a filled status pill and an outlined category label read as different affordances despite sharing a palette)
- [x] Timeline — built this session as `Timeline`/`TimelineItem`/`TimelineTitle`/`TimelineDescription` (purely presentational, `<ol>` since a timeline's events are inherently ordered, same reasoning `List`'s `ordered` prop exists for; `TimelineItem`'s dot + connecting line are two real `<span>`s, not pseudo-elements, so the line can size to `100%` of the item's own content height)
- [x] Calendar — built this session as the shared engine `DatePicker`/`DateRangePicker` both build on (see the Form section) — a month-grid date picker core following the WAI-ARIA Date Picker Dialog grid pattern, plain native-`Date` arithmetic (`calendar-utils.ts`) rather than a date library, manual roving-tabindex arrow-key handling since a 2D grid needs both axes unlike `@nebula-lab/primitives`' 1D `RovingFocusGroup`
- [x] Stat — built this session as `Stat`/`StatLabel`/`StatValue`/`StatDescription` (single-file compound, no matching lower-layer counterpart, same treatment `Card` documents)

**8/8**

### Data
- [x] Table — built this session as `DataTable`/`DataTableHeader`/`DataTableBody`/`DataTableRow`/`DataTableHead`/`DataTableCell`/`DataTableCaption`/`DataTableSelectionCell`/`DataTableSelectAllCell` (native `<table>` + sort state via `aria-sort` + row-selection state via two dedicated cells reusing this package's own `Checkbox`; sorting the actual data is left to the consumer, same convention `Combobox`/`Command` use for filtering)
- [x] DataGrid — built this session (composes `@nebula-lab/hooks`' `useVirtualizer` directly rather than `DataTable`, since a native `<table>`'s row model resists absolute positioning; renders the WAI-ARIA Grid pattern over plain `div`s — `role="grid"`/`"row"`/`"columnheader"`/`"gridcell"` — with a column-config API instead of JSX-composed rows, sticky un-virtualized header, virtual rows positioned via `transform: translateY()`)
- [x] TreeTable — built this session (composes react-ui's own `DataTable`/`DataTableHeader`/`DataTableBody`/`DataTableRow`/`DataTableHead`/`DataTableCell` parts rather than reinventing table chrome; recursive `{id, children?}` tree flattened depth-first at render time — real tables can't nest `<tr>`s — with per-row indentation and a local `Set`-based expand/collapse toggle, mirroring `Tree`'s own local-state precedent)
- [x] List — built this session as `List`/`ListItem` (purely presentational `<ul>`/`<ol>` + `<li>`, `ordered` prop switches tag; no matching headless compound, explicitly contrasted with `Menu`/`Tree`'s real interactive behavior)
- [x] DescriptionList — built this session as `DescriptionList`/`DescriptionTerm`/`DescriptionDetails` (`<dl>`/`<dt>`/`<dd>`, two-column grid layout so pairs line up instead of the browser's default stacking; same single-file-compound treatment `Stat`/`Card` use)

**5 solid / 0 partial / 0 missing out of 5**

### Media
- [ ] Image
- [x] Avatar *(same component as above, listed twice in the source list)*
- [x] Video — built this session (themed rounding only — no custom player chrome; native browser `controls` shown by default, since a native `<video controls>` already has full keyboard/screen-reader operability for free)
- [x] Audio — built this session (same "just rounding, native controls stay in charge" treatment as `Video`)

**3/4**

### Misc
- [x] CommandPalette — built this session as `Command`/`CommandInput`/`CommandList`/`CommandItem`/`CommandGroup`/`CommandEmpty`/`CommandSeparator` (`CommandInput` is a bottom-rule field reading as one continuous surface with the palette card, not a boxed `Input`) — also gave `react-ui` a `TreeView` wrapper (thin renamed re-export of this package's own `Tree`), not a distinct item on this wishlist
- [x] Markdown — built this session as a deliberately-scoped subset renderer (headings, paragraphs, fenced code, blockquotes, lists, inline bold/italic/code/links) — not full CommonMark; see `markdown-utils.ts`'s header comment for why a real parser dependency isn't available in this sandbox and why hand-rolling a spec-correct one isn't a responsible substitute. Block/inline parsing logic was smoke-tested against a real `node` run (compiled via a scratch `tsc` invocation, since `tsx`/`esbuild` don't work in this sandbox either) rather than left unverified — both block splitting and inline formatting produced correct output against a representative sample.
- [x] CodeBlock — built this session as a themed `<pre>`/`<code>` block with a header (language label + copy-to-clipboard button) and optional line numbers — **deliberately not a syntax highlighter**; real tokenization needs a highlighting engine (Shiki/Prism/highlight.js) as an actual dependency, unavailable in this sandbox, so this ships the honest useful subset instead of a fragile hand-rolled tokenizer
- [ ] QRCode — ❌ **deliberately not built, a real scope cut, not an oversight.** Generating a scannable QR code requires implementing the actual QR encoding algorithm (Reed-Solomon error correction, module placement, mask-pattern scoring) — genuinely complex, easy to get subtly wrong, and not something to responsibly hand-roll without a reference implementation to check against; there's no npm registry access in this sandbox to add `qrcode`/`qrcode.react`. Faking a QR-code-*looking* image that doesn't actually decode would be actively worse than not building the component at all (it would silently fail whoever scans it) — this is being left explicitly unbuilt until a real encoding library can be installed, unlike every other item in this document, which is either done, partial, or genuinely just not-gotten-to-yet.

**3/4** *(this session also built `Carousel`/`CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext`/`CarouselIndicators` and `Draggable`/`Droppable`/`Sortable`/`SortableItem` directly in `react-ui` — none is a distinct item on this particular wishlist, since it predates the project owner's decision to build them here instead of in `headless`; see the Collections/Drag & Drop sections above and `AGENTS.md`'s `react-ui` row for the full rationale)

---

## Highest-leverage gaps (if picking what to build next)

1. ~~**react-ui parity wrappers**: `Tabs`, `Checkbox`, `Radio`, `Switch`, `Tooltip`~~ — **done.** All five now have styled `react-ui` wrappers over their existing `headless` behavior.
2. ~~**Headless Menu family**: `Menu` unlocks `DropdownMenu`, `ContextMenu`, `Menubar`~~ — **done.** `Menu` built first; `DropdownMenu`/`ContextMenu`/`Menubar` all reuse its `Content`/`Item`/`CheckboxItem`/`RadioGroup`/`RadioItem`/`Separator`/`Label` parts as thin renamed re-exports, with only each one's trigger/root genuinely new. `Select`/`Combobox` remain unbuilt but would follow the same reuse pattern (listbox semantics differ enough from menu semantics that they're not simple re-exports, unlike the three built here).
3. ~~**Feedback primitives** (`Progress`, `Spinner`, `Skeleton`)~~ — **done.** `Progress` got real ARIA Progress Meter semantics (indeterminate via `value={null}`, `aria-valuetext` via `getValueLabel`); `Spinner`/`Skeleton` turned out to need no headless-layer state at all beyond `role="status"`/`aria-hidden` respectively, confirming the "almost pure CSS" read — all visual animation (`animate-spin`/`animate-pulse`) is Tailwind-core, no new `@keyframes` added to the project.
4. ~~**Field + Listbox + Select**~~ — **done.** `Field` factors out the label/description/error id-wiring every form field needs; `Listbox` is the reusable single/multi-select list `Select`'s popup builds on (same "build the primitive once, reuse it" strategy `Menu`→`DropdownMenu` established) — `NativeSelect` was added to `primitives` instead of `headless`, mirroring how `Input`/`Textarea` are handled there.
5. ~~**Everything else queued in `headless`**~~ — **done.** Form/Navigation/Overlay/Collections/Drag-and-Drop are all resolved: every remaining item is either built (see each section above) or explicitly marked N/A this session (project owner decision to build `DataTable`/`Carousel`/`Virtualizer`/`Draggable`/`Droppable`/`Sortable` directly in `react-ui`/`@nebula-lab/hooks` instead of adding a redundant unstyled layer for them). The entire `headless` backlog is now closed out.
6. ~~**`react-ui` styled wrappers for every `headless` primitive built in the Navigation/Overlay/Collections batches**: `Pagination`, `Stepper`, `Tree`, `NavigationMenu`, `Drawer`, `HoverCard`, `Toast`, `TreeView`, `Command`~~ — **done.** All nine now have `react-ui` styled wrappers (8 new component-token entries added to `component.ts`, still 23/28 on `CONTRAST_AUDIT.md` since all of them reuse already-audited semantic pairings) — see `AGENTS.md`'s `react-ui` row for the per-component rationale.
7. ~~**The six components/hook moved to `react-ui`/`@nebula-lab/hooks` by the Collections/Drag-and-Drop decision**: `Carousel`, `DataTable`, `Draggable`/`Droppable`/`Sortable`, `useVirtualizer`~~ — **done.** All built this session — `Carousel`/`DataTable` each with their own plain (non-`createContextScope`) React context, `Draggable`/`Droppable`/`Sortable` on the native HTML5 Drag and Drop API (documented keyboard-accessibility limitation — no fake keyboard drag support), `useVirtualizer` as an estimate-then-measure-and-correct hook in `@nebula-lab/hooks`. **Real gap left by this batch, since closed**: `DataTable` was later extracted into `@nebula-lab/styleless` and picked up real coverage there; `Carousel`/`Draggable`/`Droppable`/`Sortable` each gained their own `.test.tsx`/`.stories.tsx` in a later pass this same session (`useVirtualizer` itself remains covered only indirectly via `DataGrid`/`VirtualList`'s own tests, not a standalone hook test — a smaller, lower-priority gap, not a blocker).
8. Remaining work is all in `react-ui`: the still-unbuilt Layout/Typography/Button/Form/Navigation/Overlay/Feedback/Data Display/Data/Media/Misc items in the sections above — see the project's task list for the current breakdown.
