# Component Coverage Audit

Cross-check of the target component list against the actual `packages/*/src` tree (checked directly, not against docs). Legend: ✅ built · ⚠️ partial / covered under a different name or layer · ❌ not started · 🚫 explicitly out of scope (per project owner direction — `Span` and the Primitive `Utilities` subsection).

**Updated** after this session's build pass: Primitive's `VStack`/`HStack`/`Wrap`/`Spacer`/`Image` gap is now closed; `react-ui` gained styled wrappers for `Tooltip`/`Tabs`/`Checkbox`/`Switch`/`RadioGroup` (the styleless behavior already existed for all five — this was the "cheapest big win" flagged below).

## Headline numbers

| Layer | Covered | Partial | Missing | Total (in scope) |
| --- | --- | --- | --- | --- |
| Primitive | 20 | 0 | 0 | 20 (Core+Elements+Layout; `Utilities` subsection and `Span` out of scope) |
| Styleless | 21 | 0 | 31 | 52 |
| react-ui | 14 | 4 | 54 | 72 |

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
- [ ] Form
- [ ] Field
- [ ] Input — (native `<input>` + `primitives`' `Input` covers the non-stateful case)
- [ ] Textarea
- [ ] NumberInput
- [ ] OTPInput
- [x] Checkbox
- [ ] CheckboxGroup
- [x] RadioGroup
- [x] Switch
- [ ] Select
- [ ] NativeSelect
- [ ] Combobox
- [ ] Autocomplete
- [ ] Slider
- [ ] RangeSlider
- [ ] Rating
- [ ] ColorPicker
- [ ] FileUpload

**3/19**

### Navigation
- [x] Tabs
- [x] Accordion
- [x] Collapsible — built this session, as its own standalone primitive (`Accordion` itself hasn't been migrated onto it — a separate, orthogonal change — but the shared primitive the note here previously flagged as missing now exists)
- [x] Breadcrumb — built this session (`nav`/`ol`/`li` structural composition + `BreadcrumbPage`'s `aria-current="page"`; no state machine, same "almost pure markup" profile as `Progress`/`Spinner`/`Skeleton`)
- [ ] Pagination
- [ ] NavigationMenu
- [x] Menu — built this session, along with `DropdownMenu` (thin renamed re-export) as its own subpath, not separately tracked in this list
- [x] Menubar — built this session
- [x] ContextMenu — built this session
- [ ] Tree
- [ ] Stepper

**7/11**

### Overlay
- [x] Dialog
- [x] AlertDialog — built this session, composed on top of `Dialog` exactly as previously flagged: reuses `Dialog`'s root/context/Trigger/Portal/Overlay/Title/Description directly, only `AlertDialogContent` (`role="alertdialog"`, no outside-click dismissal — deliberately no `onPointerDownOutside` prop at all) is a real second implementation
- [ ] Drawer
- [x] Popover
- [x] Tooltip — built this session
- [ ] HoverCard
- [ ] Toast

**4/7**

### Collections
- [ ] Listbox
- [ ] Command
- [ ] DataTable
- [ ] TreeView
- [ ] Carousel
- [ ] Virtualizer

**0/6**

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
4. Everything else (Form fields, remaining Navigation/Overlay/Collections/Drag-and-Drop in `styleless`; Layout/Typography/Data/Media/Misc in `react-ui`) is queued but not yet started — see the project's task list for the current breakdown.
