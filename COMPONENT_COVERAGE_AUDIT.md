# Component Coverage Audit

Cross-check of the target component list against the actual `packages/*/src` tree (checked directly, not against docs). Legend: ✅ built · ⚠️ partial / covered under a different name or layer · ❌ not started · 🚫 explicitly out of scope (per project owner direction — `Span` and the Primitive `Utilities` subsection).

**Updated** after this session's build pass: Primitive's `VStack`/`HStack`/`Wrap`/`Spacer`/`Image` gap is now closed; `react-ui` gained styled wrappers for `Tooltip`/`Tabs`/`Checkbox`/`Switch`/`RadioGroup` (the styleless behavior already existed for all five — this was the "cheapest big win" flagged below).

## Headline numbers

| Layer | Covered | Partial | Missing | Total (in scope) |
| --- | --- | --- | --- | --- |
| Primitive | 20 | 0 | 0 | 20 (Core+Elements+Layout; `Utilities` subsection and `Span` out of scope — `Button`/`Input`/`Textarea`/`Label`/`Form`/`NativeSelect` aren't tracked as separate checklist items in this audit, but all exist; see `AGENTS.md`'s `packages/primitives` row) |
| Styleless | 40 | 0 | 7 | 52 (5 of the original 31 gaps — `Form`/`Input`/`Textarea`/`NativeSelect`/`RangeSlider` — are now marked N/A: the first three covered by `primitives` directly, `NativeSelect` likewise, `RangeSlider` subsumed by `Slider`'s multi-thumb support) |
| react-ui | 15 | 4 | 53 | 72 |

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
- [ ] Command
- [ ] DataTable
- [ ] TreeView
- [ ] Carousel
- [ ] Virtualizer

**1/6**

### Feedback
- [x] Progress — built this session (`Progress`/`ProgressIndicator`, WAI-ARIA Progress Meter pattern, indeterminate via `value={null}`)
- [x] Spinner — built this session (`role="status"` + visually-hidden label; no visual spin animation at this layer, that's `react-ui`'s job)
- [x] Skeleton — built this session (`aria-hidden` placeholder; no shimmer at this layer)

**3/3**

### Drag & Drop
- [ ] Draggable
- [ ] Droppable
- [ ] Sortable

**0/3**

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
- [ ] Pagination
- [ ] Navbar
- [ ] Sidebar
- [ ] Menu
- [ ] DropdownMenu

**1/7**

### Overlay
- [ ] Modal — ⚠️ `Dialog` (this package) covers the same job under a different name
- [ ] Drawer
- [ ] Sheet
- [x] Popover
- [x] Tooltip — built this session (styled off `neutral`/`neutral-content` rather than `Popover`/`Dialog`'s `base-100`/`base-content`)
- [ ] AlertDialog

**2 solid / 1 partial / 3 missing out of 6**

### Feedback
- [ ] Alert
- [ ] Toast
- [x] Progress — built this session (styled wrapper: fill percentage computed from `value`/`max` and applied as an inline `translateX`; indeterminate uses Tailwind's built-in `animate-pulse` rather than a custom sliding-bar `@keyframes`)
- [x] Spinner — built this session (border-ring + `animate-spin`, both Tailwind-core)
- [x] Skeleton — built this session (`animate-pulse` fill, default `--radius-box`, override via `className` for other shapes)
- [ ] EmptyState

**3/6**

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
- [ ] Table
- [ ] DataGrid
- [ ] TreeTable
- [ ] List
- [ ] DescriptionList

**0/5**

### Media
- [ ] Image
- [x] Avatar *(same component as above, listed twice in the source list)*
- [ ] Video
- [ ] Audio

**1/4**

### Misc
- [ ] CommandPalette
- [ ] Markdown
- [ ] CodeBlock
- [ ] QRCode

**0/4**

---

## Highest-leverage gaps (if picking what to build next)

1. ~~**react-ui parity wrappers**: `Tabs`, `Checkbox`, `Radio`, `Switch`, `Tooltip`~~ — **done.** All five now have styled `react-ui` wrappers over their existing `styleless` behavior.
2. ~~**Styleless Menu family**: `Menu` unlocks `DropdownMenu`, `ContextMenu`, `Menubar`~~ — **done.** `Menu` built first; `DropdownMenu`/`ContextMenu`/`Menubar` all reuse its `Content`/`Item`/`CheckboxItem`/`RadioGroup`/`RadioItem`/`Separator`/`Label` parts as thin renamed re-exports, with only each one's trigger/root genuinely new. `Select`/`Combobox` remain unbuilt but would follow the same reuse pattern (listbox semantics differ enough from menu semantics that they're not simple re-exports, unlike the three built here).
3. ~~**Feedback primitives** (`Progress`, `Spinner`, `Skeleton`)~~ — **done.** `Progress` got real ARIA Progress Meter semantics (indeterminate via `value={null}`, `aria-valuetext` via `getValueLabel`); `Spinner`/`Skeleton` turned out to need no styleless-layer state at all beyond `role="status"`/`aria-hidden` respectively, confirming the "almost pure CSS" read — all visual animation (`animate-spin`/`animate-pulse`) is Tailwind-core, no new `@keyframes` added to the project.
4. ~~**Field + Listbox + Select**~~ — **done.** `Field` factors out the label/description/error id-wiring every form field needs; `Listbox` is the reusable single/multi-select list `Select`'s popup builds on (same "build the primitive once, reuse it" strategy `Menu`→`DropdownMenu` established) — `NativeSelect` was added to `primitives` instead of `styleless`, mirroring how `Input`/`Textarea` are handled there.
5. Everything else (remaining Form fields — `NumberInput`/`CheckboxGroup`/`Combobox`/`Autocomplete`/`Slider`/`RangeSlider`/`Rating`/`OTPInput`/`ColorPicker`/`FileUpload` — plus Navigation/Overlay/Collections/Drag-and-Drop in `styleless`; Layout/Typography/Data/Media/Misc in `react-ui`) is queued but not yet started — see the project's task list for the current breakdown.
