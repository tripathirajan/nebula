# Component Coverage Audit

Cross-check of the target component list against the actual `packages/*/src` tree (checked directly, not against docs). Legend: ✅ built · ⚠️ partial / covered under a different name or layer · ❌ not started · 🚫 explicitly out of scope (per project owner direction — `Span` and the Primitive `Utilities` subsection).

**Updated** after this session's build pass: Primitive's `VStack`/`HStack`/`Wrap`/`Spacer`/`Image` gap is now closed; `react-ui` gained styled wrappers for `Tooltip`/`Tabs`/`Checkbox`/`Switch`/`RadioGroup` (the styleless behavior already existed for all five — this was the "cheapest big win" flagged below).

## Headline numbers

| Layer | Covered | Partial | Missing | Total (in scope) |
| --- | --- | --- | --- | --- |
| Primitive | 20 | 0 | 0 | 20 (Core+Elements+Layout; `Utilities` subsection and `Span` out of scope) |
| Styleless | 8 | 0 | 44 | 52 |
| react-ui | 11 | 4 | 57 | 72 |

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
- [ ] Toggle — not built
- [ ] ToggleGroup — not built

**0/3**

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
- [ ] Collapsible — not built as its own primitive (Accordion has its own expand/collapse logic inline rather than composing a shared `Collapsible`)
- [ ] Breadcrumb
- [ ] Pagination
- [ ] NavigationMenu
- [ ] Menu
- [ ] Menubar
- [ ] ContextMenu
- [ ] Tree
- [ ] Stepper

**2/11**

### Overlay
- [x] Dialog
- [ ] AlertDialog — not built (could compose on top of `Dialog`, not done yet)
- [ ] Drawer
- [x] Popover
- [x] Tooltip — built this session
- [ ] HoverCard
- [ ] Toast

**3/7**

### Collections
- [ ] Listbox
- [ ] Command
- [ ] DataTable
- [ ] TreeView
- [ ] Carousel
- [ ] Virtualizer

**0/6**

### Feedback
- [ ] Progress
- [ ] Spinner
- [ ] Skeleton

**0/3**

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
- [ ] Progress
- [ ] Spinner
- [ ] Skeleton
- [ ] EmptyState

**0/6**

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
2. **Styleless Menu family**: `Menu` unlocks `DropdownMenu`, `ContextMenu`, `Menubar`, and `Select`/`Combobox` (all of these are usually thin variations on one underlying menu/listbox pattern in real component libraries) — highest reuse-per-component-built ratio of what's left.
3. **Feedback primitives** (`Progress`, `Spinner`, `Skeleton`): no ARIA state machine needed, almost pure CSS — low effort, currently 0% covered across both `styleless` and `react-ui`.
4. Everything else (Form fields, remaining Navigation/Overlay/Collections/Drag-and-Drop in `styleless`; Layout/Typography/Data/Media/Misc in `react-ui`) is queued but not yet started — see the project's task list for the current breakdown.
