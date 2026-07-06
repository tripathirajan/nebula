# Component Coverage Audit

Cross-check of the target component list against the actual `packages/*/src` tree (checked directly, not against docs). Legend: ✅ built · ⚠️ partial / covered under a different name or layer · ❌ not started · 🚫 explicitly out of scope (per project owner direction — `Span` and the Primitive `Utilities` subsection).

**Updated** after this session's build pass: Primitive's `VStack`/`HStack`/`Wrap`/`Spacer`/`Image` gap is now closed; `react-ui` gained styled wrappers for `Tooltip`/`Tabs`/`Checkbox`/`Switch`/`RadioGroup` (the styleless behavior already existed for all five — this was the "cheapest big win" flagged below).

## Headline numbers

| Layer | Covered | Partial | Missing | Total (in scope) |
| --- | --- | --- | --- | --- |
| Primitive | 20 | 0 | 0 | 20 (Core+Elements+Layout; `Utilities` subsection and `Span` out of scope — `Button`/`Input`/`Textarea`/`Label`/`Form`/`NativeSelect` aren't tracked as separate checklist items in this audit, but all exist; see `AGENTS.md`'s `packages/primitives` row) |
| Styleless | 41 | 0 | 0 | 52 (the styleless backlog is now fully resolved — every unchecked item across the whole layer, 11 total, is explicitly N/A rather than "not started yet": `Form`/`Input`/`Textarea`/`NativeSelect` covered by `primitives` directly, `RangeSlider` subsumed by `Slider`'s multi-thumb support, `Button` covered by `primitives`' non-stateful `Button`, and — a project owner decision this session — `DataTable`/`Carousel`/`Virtualizer`/`Draggable`/`Droppable`/`Sortable` are deliberately being built directly in `react-ui`/`@nebula/hooks` instead of getting a separate unstyled layer, since they don't have the kind of independent ARIA-behavior-vs-styling split the rest of this package's components do) |
| react-ui | 19 | 5 | 54 | 78 (recounted directly from this session's per-section tallies — Layout 1/2/8/11, Typography 0/0/5/5, Button 1/0/4/5, Form 3/1/13/17, Navigation 2/0/5/7, Overlay 3/1/2/6, Feedback 4/0/2/6, Data Display 2/0/6/8, Data 1/1/3/5, Media 1/0/3/4, Misc 1/0/3/4; the previous headline of "72" predates this session and didn't match a sum of the section totals even before this session's edits — corrected here rather than propagated) |

Primitive is now fully covered for the in-scope items. Styleless and react-ui are intentionally much further behind — this list is a full "everything a mature design system could have" wishlist (roughly Radix + Chakra + Mantine combined in scope), not a near-term backlog.

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

## Styleless

### Button
- [ ] Button — not built (native `<button>` + `primitives`' `Button` covers the non-stateful case; no styleless wrapper needed unless it grows state)
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
- [ ] DataTable — N/A in `styleless` (project owner decision): mostly sort/selection *state* over a native `<table>`, not a distinct ARIA widget worth a separate unstyled layer — **built directly in `react-ui`** this session (see that layer's Data section below)
- [x] TreeView — built this session (thin renamed re-export of every `Tree` part, same call `Autocomplete` makes reusing `Combobox`)
- [ ] Carousel — N/A in `styleless` (project owner decision) — **built directly in `react-ui`** this session (see that layer's Misc section below)
- [ ] Virtualizer — N/A in `styleless`/`react-ui` (project owner decision): pure windowing math with no ARIA semantics of its own — **built this session** as `useVirtualizer` in `@nebula/hooks`, not a component in either layer

**3/6 (3 marked N/A — see notes)**

### Feedback
- [x] Progress — built this session (`Progress`/`ProgressIndicator`, WAI-ARIA Progress Meter pattern, indeterminate via `value={null}`)
- [x] Spinner — built this session (`role="status"` + visually-hidden label; no visual spin animation at this layer, that's `react-ui`'s job)
- [x] Skeleton — built this session (`aria-hidden` placeholder; no shimmer at this layer)

**3/3**

### Drag & Drop
- [ ] Draggable — N/A in `styleless` (project owner decision) — **built directly in `react-ui`** this session (native HTML5 Drag and Drop API; see `react-ui`'s row in `AGENTS.md` for the documented keyboard-accessibility limitation)
- [ ] Droppable — N/A in `styleless`, same reasoning — **built this session**
- [ ] Sortable — N/A in `styleless`, same reasoning — **built this session** as `Sortable`/`SortableItem`

**0/3 (all 3 marked N/A in this layer — moved to `react-ui` and built there this session, see notes)**

---

## react-ui

### Layout
- [ ] AppShell — ⚠️ `react-ui-blocks` has `AppLayout`, a similar concept one layer up, not this package
- [ ] Header
- [ ] Footer
- [ ] Sidebar
- [ ] Navbar
- [ ] Main
- [ ] Section
- [x] Card
- [ ] Surface
- [ ] Paper
- [ ] Divider — ⚠️ `Separator` (this package) covers the same job under a different name

**1 solid / 2 partial / 8 missing out of 11**

### Typography
- [ ] Text — not restyled in `react-ui` (only exists unstyled in `primitives`)
- [ ] Heading — same
- [ ] Code — same
- [ ] Blockquote
- [ ] Kbd

**0/5**

### Button
- [x] Button
- [ ] IconButton
- [ ] ButtonGroup
- [ ] SplitButton
- [ ] FAB

**1/5**

### Form
- [ ] TextField — ⚠️ `Input` covers this job under a different name
- [ ] PasswordField
- [ ] SearchField
- [ ] NumberField
- [ ] TextArea
- [x] Checkbox — built this session (checkmark/dash indicator, `data-state`-driven)
- [x] Radio — built this session as `RadioGroup`/`RadioGroupItem` (indicator circle + dot rendered before the item's own children)
- [x] Switch — built this session (track + sliding thumb)
- [ ] Select
- [ ] MultiSelect
- [ ] Combobox
- [ ] DatePicker
- [ ] DateRangePicker
- [ ] TimePicker
- [ ] ColorPicker
- [ ] Rating
- [ ] FileUploader

**3 solid / 1 partial / 13 missing out of 17**

### Navigation
- [x] Tabs — built this session (underline treatment via `data-[state=active]` + `-mb-px`)
- [ ] Breadcrumb
- [x] Pagination — built this session (styled wrapper: `PaginationLink`'s `data-[state=active]` fills with `--pagination-link-active-bg`/`-text`; root itself is a chrome-free re-export)
- [ ] Navbar
- [ ] Sidebar
- [ ] Menu
- [ ] DropdownMenu

**2/7** *(this session also gave `react-ui` styled wrappers to `Stepper`/`Tree`/`NavigationMenu` — not distinct items on this particular wishlist, but see `AGENTS.md`'s `react-ui` row for the full list)*

### Overlay
- [ ] Modal — ⚠️ `Dialog` (this package) covers the same job under a different name
- [x] Drawer — built this session (`DrawerContent` is the one real second implementation: four `data-[side=*]` variants, each with its own fixed edge + `data-[state=closed]` translate-out transform; everything else reuses `Dialog`'s own parts restyled against `drawerTokens`)
- [ ] Sheet
- [x] Popover
- [x] Tooltip — built this session (styled off `neutral`/`neutral-content` rather than `Popover`/`Dialog`'s `base-100`/`base-content`)
- [ ] AlertDialog

**3 solid / 1 partial / 2 missing out of 6** *(this session also gave `react-ui` styled wrappers to `HoverCard` — not a distinct item on this wishlist)*

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
- [ ] AvatarGroup
- [x] Badge
- [ ] Chip
- [ ] Tag
- [ ] Timeline
- [ ] Calendar
- [ ] Stat

**2/8**

### Data
- [x] Table — built this session as `DataTable`/`DataTableHeader`/`DataTableBody`/`DataTableRow`/`DataTableHead`/`DataTableCell`/`DataTableCaption`/`DataTableSelectionCell`/`DataTableSelectAllCell` (native `<table>` + sort state via `aria-sort` + row-selection state via two dedicated cells reusing this package's own `Checkbox`; sorting the actual data is left to the consumer, same convention `Combobox`/`Command` use for filtering)
- [ ] DataGrid — ⚠️ `DataTable` covers sort/selection; no virtualized-grid variant yet (would compose with `useVirtualizer`)
- [ ] TreeTable
- [ ] List
- [ ] DescriptionList

**1 solid / 1 partial / 3 missing out of 5**

### Media
- [ ] Image
- [x] Avatar *(same component as above, listed twice in the source list)*
- [ ] Video
- [ ] Audio

**1/4**

### Misc
- [x] CommandPalette — built this session as `Command`/`CommandInput`/`CommandList`/`CommandItem`/`CommandGroup`/`CommandEmpty`/`CommandSeparator` (`CommandInput` is a bottom-rule field reading as one continuous surface with the palette card, not a boxed `Input`) — also gave `react-ui` a `TreeView` wrapper (thin renamed re-export of this package's own `Tree`), not a distinct item on this wishlist
- [ ] Markdown
- [ ] CodeBlock
- [ ] QRCode

**1/4** *(this session also built `Carousel`/`CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext`/`CarouselIndicators` and `Draggable`/`Droppable`/`Sortable`/`SortableItem` directly in `react-ui` — none is a distinct item on this particular wishlist, since it predates the project owner's decision to build them here instead of in `styleless`; see the Collections/Drag & Drop sections above and `AGENTS.md`'s `react-ui` row for the full rationale)

---

## Highest-leverage gaps (if picking what to build next)

1. ~~**react-ui parity wrappers**: `Tabs`, `Checkbox`, `Radio`, `Switch`, `Tooltip`~~ — **done.** All five now have styled `react-ui` wrappers over their existing `styleless` behavior.
2. ~~**Styleless Menu family**: `Menu` unlocks `DropdownMenu`, `ContextMenu`, `Menubar`~~ — **done.** `Menu` built first; `DropdownMenu`/`ContextMenu`/`Menubar` all reuse its `Content`/`Item`/`CheckboxItem`/`RadioGroup`/`RadioItem`/`Separator`/`Label` parts as thin renamed re-exports, with only each one's trigger/root genuinely new. `Select`/`Combobox` remain unbuilt but would follow the same reuse pattern (listbox semantics differ enough from menu semantics that they're not simple re-exports, unlike the three built here).
3. ~~**Feedback primitives** (`Progress`, `Spinner`, `Skeleton`)~~ — **done.** `Progress` got real ARIA Progress Meter semantics (indeterminate via `value={null}`, `aria-valuetext` via `getValueLabel`); `Spinner`/`Skeleton` turned out to need no styleless-layer state at all beyond `role="status"`/`aria-hidden` respectively, confirming the "almost pure CSS" read — all visual animation (`animate-spin`/`animate-pulse`) is Tailwind-core, no new `@keyframes` added to the project.
4. ~~**Field + Listbox + Select**~~ — **done.** `Field` factors out the label/description/error id-wiring every form field needs; `Listbox` is the reusable single/multi-select list `Select`'s popup builds on (same "build the primitive once, reuse it" strategy `Menu`→`DropdownMenu` established) — `NativeSelect` was added to `primitives` instead of `styleless`, mirroring how `Input`/`Textarea` are handled there.
5. ~~**Everything else queued in `styleless`**~~ — **done.** Form/Navigation/Overlay/Collections/Drag-and-Drop are all resolved: every remaining item is either built (see each section above) or explicitly marked N/A this session (project owner decision to build `DataTable`/`Carousel`/`Virtualizer`/`Draggable`/`Droppable`/`Sortable` directly in `react-ui`/`@nebula/hooks` instead of adding a redundant unstyled layer for them). The entire `styleless` backlog is now closed out.
6. ~~**`react-ui` styled wrappers for every `styleless` primitive built in the Navigation/Overlay/Collections batches**: `Pagination`, `Stepper`, `Tree`, `NavigationMenu`, `Drawer`, `HoverCard`, `Toast`, `TreeView`, `Command`~~ — **done.** All nine now have `react-ui` styled wrappers (8 new component-token entries added to `component.ts`, still 23/28 on `CONTRAST_AUDIT.md` since all of them reuse already-audited semantic pairings) — see `AGENTS.md`'s `react-ui` row for the per-component rationale.
7. ~~**The six components/hook moved to `react-ui`/`@nebula/hooks` by the Collections/Drag-and-Drop decision**: `Carousel`, `DataTable`, `Draggable`/`Droppable`/`Sortable`, `useVirtualizer`~~ — **done.** All built this session — `Carousel`/`DataTable` each with their own plain (non-`createContextScope`) React context, `Draggable`/`Droppable`/`Sortable` on the native HTML5 Drag and Drop API (documented keyboard-accessibility limitation — no fake keyboard drag support), `useVirtualizer` as an estimate-then-measure-and-correct hook in `@nebula/hooks`. **Real gap left by this batch**: none of the five components have stories or tests yet, unlike everything else in `react-ui` — worth prioritizing next since (unlike every other `react-ui` wrapper) there's no `@nebula/styleless` test coverage underneath them to lean on.
8. Remaining work is all in `react-ui`: the still-unbuilt Layout/Typography/Button/Form/Navigation/Overlay/Feedback/Data Display/Data/Media/Misc items in the sections above — see the project's task list for the current breakdown.
