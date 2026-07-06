# @nebula/styleless

Behavior-only, ARIA-complete compound components. No styling opinions — that's `@nebula/react-ui`'s job, built on top of this package. (Formerly `@nebula/headless` — renamed because "styleless" says directly what this layer guarantees, without the overloaded "headless UI" jargon.)

## What's here

- `Tabs` / `TabList` / `Tab` / `TabPanel` — WAI-ARIA Tabs pattern: roving-tabindex arrow-key navigation (Left/Right or Up/Down depending on `orientation`, plus Home/End), `automatic` or `manual` activation mode, controlled or uncontrolled `value`. Nested `Tabs` instances don't collide (scoped context via `@nebula/primitives`).
- `Checkbox` — tri-state (`checked` / `unchecked` / `indeterminate`), hidden-native-input technique so it participates in real `<form>`/`FormData` submission and fires genuine `click`/`input`/`change` events.
- `Switch` — same hidden-native-input pattern as `Checkbox`, WAI-ARIA Switch role.
- `RadioGroup` / `RadioGroupItem` — WAI-ARIA Radio Group pattern, built on `@nebula/primitives`' `RovingFocusGroup`/`FocusItem` rather than hand-rolling roving-tabindex again.
- `Accordion` / `AccordionItem` / `AccordionHeader` / `AccordionTrigger` / `AccordionContent` — WAI-ARIA Accordion pattern, `type="single"` (with `collapsible`) or `type="multiple"`, arrow-key navigation between triggers via `RovingFocusGroup`/`FocusItem`, panel wrapped in `@nebula/primitives`' `Presence` so consumers can animate expand/collapse off `data-state` instead of it unmounting instantly.
- `Dialog` / `DialogTrigger` / `DialogPortal` / `DialogOverlay` / `DialogContent` / `DialogTitle` / `DialogDescription` / `DialogClose` — WAI-ARIA Dialog (Modal) pattern. `DialogContent` composes `@nebula/primitives`' `Presence` + `DismissibleLayer` (Escape/outside-click) + `FocusScope` (`trapped` when `modal`, the root's default) via `asChild` chaining, so it's one real DOM node despite the layered behavior.
- `Popover` / `PopoverTrigger` / `PopoverPortal` / `PopoverContent` / `PopoverClose` — the non-modal sibling of `Dialog`: anchor-positioned (via `@nebula/primitives`' `Popper`, composed into `Popover`'s own scope so a single `__scopePopover` threads through both), `role="dialog"` without `aria-modal`, `FocusScope` with `trapped={false}` (focus moves in on open and restores to the trigger on close, but Tab isn't cycled), dismissed via `Escape`/outside-click same as `Dialog`. `PopoverTrigger` toggles open/closed on click, unlike `DialogTrigger` which only opens.

## Import

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@nebula/styleless';
// or per-component subpath
import { Tabs, TabList, Tab, TabPanel } from '@nebula/styleless/tabs';
import { Checkbox } from '@nebula/styleless/checkbox';
import { Switch } from '@nebula/styleless/switch';
import { RadioGroup, RadioGroupItem } from '@nebula/styleless/radio-group';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '@nebula/styleless/accordion';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@nebula/styleless/dialog';
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverClose,
} from '@nebula/styleless/popover';
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

Next up in this layer (not yet built): `Tooltip` — see `component-library-architecture.md` §4.2–§4.3 and `AGENTS.md`'s status table for what's actually built.
