# @nebula-lab/headless

Behavior-only, ARIA-complete compound components. No styling opinions — that's `@nebula-lab/react-ui`'s job, built on top of this package and `@nebula-lab/styleless`. (This package was renamed `@nebula-lab/headless` → `@nebula-lab/styleless` → back to `@nebula-lab/headless`: the project owner confirmed a 5-tier model where `headless` — this package — and `styleless` — a distinct layer — are two different things, not one renamed package. See `AGENTS.md`'s "Layer placement" section.)

## Installation

```bash
npm install @nebula-lab/headless
# or
yarn add @nebula-lab/headless
# or
pnpm add @nebula-lab/headless
# or
bun add @nebula-lab/headless
```

Peer dependencies: `react ^19.0.0`, `react-dom ^19.0.0`. npm is shown first since it ships with Node.js and remains the most widely used option, but yarn, pnpm, and bun all work identically.

**Module format:** ESM only (no CommonJS build). Works out of the box with any bundler (Vite, Next.js, Webpack 5+, esbuild, Parcel) or native Node.js ESM. A plain CommonJS `require('@nebula-lab/headless')` is **not** supported and throws `ERR_REQUIRE_ESM` — use `import` (or dynamic `import()` from a CJS file) instead.

**TypeScript / JavaScript:** Ships hand-written `.d.ts` types alongside the JS output, but nothing requires TypeScript — plain JavaScript works identically. TypeScript users get full autocomplete/type-checking for free; JavaScript users just don't see the type annotations.

## What's here

Every component below follows its WAI-ARIA APG pattern (roving-tabindex, correct roles/states, full keyboard support) and exposes state via `data-state`/`data-orientation`/`data-disabled` attributes rather than requiring you to track it yourself.

**Overlays** — `Dialog`, `AlertDialog`, `Drawer`, `Popover`, `HoverCard`, `Tooltip`

**Menus** — `Menu`, `DropdownMenu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Command`

**Disclosure** — `Accordion`, `Collapsible`

**Selection controls** — `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`, `Toggle`, `ToggleGroup`, `Select`, `Listbox`, `Combobox`, `Autocomplete`, `ColorPicker`, `Rating`

**Text/numeric input** — `NumberInput`, `OtpInput`, `Slider`, `FileUpload`, `Field` (label/control/description/error wiring)

**Navigation** — `Tabs`, `Breadcrumb`, `Pagination`, `Stepper`

**Feedback** — `Toast`, `Progress`, `Spinner`, `Skeleton`

**Data** — `Tree`, `TreeView`

See `AGENTS.md`'s status table for the authoritative, currently-maintained inventory as new components land.

- `Tabs` / `TabList` / `Tab` / `TabPanel` — WAI-ARIA Tabs pattern: roving-tabindex arrow-key navigation (Left/Right or Up/Down depending on `orientation`, plus Home/End), `automatic` or `manual` activation mode, controlled or uncontrolled `value`. Nested `Tabs` instances don't collide (scoped context via `@nebula-lab/primitives`).
- `Checkbox` — tri-state (`checked` / `unchecked` / `indeterminate`), hidden-native-input technique so it participates in real `<form>`/`FormData` submission and fires genuine `click`/`input`/`change` events.
- `Switch` — same hidden-native-input pattern as `Checkbox`, WAI-ARIA Switch role.
- `RadioGroup` / `RadioGroupItem` — WAI-ARIA Radio Group pattern, built on `@nebula-lab/primitives`' `RovingFocusGroup`/`FocusItem` rather than hand-rolling roving-tabindex again.
- `Accordion` / `AccordionItem` / `AccordionHeader` / `AccordionTrigger` / `AccordionContent` — WAI-ARIA Accordion pattern, `type="single"` (with `collapsible`) or `type="multiple"`, arrow-key navigation between triggers via `RovingFocusGroup`/`FocusItem`, panel wrapped in `@nebula-lab/primitives`' `Presence` so consumers can animate expand/collapse off `data-state` instead of it unmounting instantly.
- `Dialog` / `DialogTrigger` / `DialogPortal` / `DialogOverlay` / `DialogContent` / `DialogTitle` / `DialogDescription` / `DialogClose` — WAI-ARIA Dialog (Modal) pattern. `DialogContent` composes `@nebula-lab/primitives`' `Presence` + `DismissibleLayer` (Escape/outside-click) + `FocusScope` (`trapped` when `modal`, the root's default) via `asChild` chaining, so it's one real DOM node despite the layered behavior.
- `Popover` / `PopoverTrigger` / `PopoverPortal` / `PopoverContent` / `PopoverClose` — the non-modal sibling of `Dialog`: anchor-positioned (via `@nebula-lab/primitives`' `Popper`, composed into `Popover`'s own scope so a single `__scopePopover` threads through both), `role="dialog"` without `aria-modal`, `FocusScope` with `trapped={false}` (focus moves in on open and restores to the trigger on close, but Tab isn't cycled), dismissed via `Escape`/outside-click same as `Dialog`. `PopoverTrigger` toggles open/closed on click, unlike `DialogTrigger` which only opens.

## Import

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@nebula-lab/headless';
// or per-component subpath
import { Tabs, TabList, Tab, TabPanel } from '@nebula-lab/headless/tabs';
import { Checkbox } from '@nebula-lab/headless/checkbox';
import { Switch } from '@nebula-lab/headless/switch';
import { RadioGroup, RadioGroupItem } from '@nebula-lab/headless/radio-group';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '@nebula-lab/headless/accordion';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@nebula-lab/headless/dialog';
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverClose,
} from '@nebula-lab/headless/popover';
```

```tsx
<Tabs defaultValue="account">
  <TabList>
    <Tab value="account">Account</Tab>
    <Tab value="password">Password</Tab>
  </TabList>
  <TabPanel value="account">...</TabPanel>
  <TabPanel value="password">...</TabPanel>
</Tabs>

<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionHeader>
      <AccordionTrigger>What is nebula?</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>A composable React UI platform.</AccordionContent>
  </AccordionItem>
</Accordion>

<Dialog>
  <DialogTrigger>Delete item</DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogTitle>Delete item?</DialogTitle>
      <DialogDescription>This can&apos;t be undone.</DialogDescription>
      <DialogClose>Cancel</DialogClose>
    </DialogContent>
  </DialogPortal>
</Dialog>

<Popover>
  <PopoverTrigger>Filters</PopoverTrigger>
  <PopoverPortal>
    <PopoverContent side="bottom" align="start" sideOffset={4}>
      <p>Filter options.</p>
      <PopoverClose>Done</PopoverClose>
    </PopoverContent>
  </PopoverPortal>
</Popover>
```

## API reference

Every component here ships with a live Storybook entry (controls, source, interaction tests) — that's the authoritative API reference, not this README: **https://tripathirajan.github.io/nebula/**

## Contributing

See the [monorepo's CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT
