# @nebula-lab/primitives

Low-level DOM abstractions and layout components for building accessible, composable React applications. Unstyled and polymorphic — no visuals, no opinions about styling; just behavior and composition that every other `@nebula-lab/*` package builds on.

## Installation

```bash
pnpm add @nebula-lab/primitives
```

Peer dependencies: `react ^19.0.0`, `react-dom ^19.0.0`.

## Features

### 🎯 Layout Utilities

`Box`, `Flex`, `Grid`, `Stack`, `Container`, `Center`, `AspectRatio`, `Inline` — polymorphic layout building blocks over `Primitive`, styled with static Tailwind classes (no arbitrary-value runtime string building). Plus `HStack`/`VStack` (row/column `Flex` aliases with sensible gap/align defaults), `Wrap` (an `Inline` alias), and `Spacer` (an `aria-hidden` flex-grow filler).

### 📝 Text Components

`Text`, `Heading`, `Paragraph`, `Code`, `Pre`, `Link` — semantic text elements, each resolving its own sensible default tag (`span`, `h1`-`h6` via `level`, `p`, `code`, `pre`, `a`) independent of `Primitive`'s own `div` fallback.

### ♿ Accessibility

`VisuallyHidden`, `FocusScope`, `DismissibleLayer`, `Boundary`, `RovingFocusGroup` + `FocusItem` — focus trapping, outside-click/Escape dismissal (topmost-layer-only via an internal open-layer stack), roving tabindex keyboard navigation, and an error boundary.

### 🎛️ Form Primitives

`Button`, `Input`, `Textarea`, `Label`, `Form`, `NativeSelect` — unstyled form controls with sane defaults (`Button` defaults `type="button"`; `Input`/`Textarea` map `invalid` to `aria-invalid`; `Textarea` supports `autoResize`; `Label` supports a `required` indicator; `Form` always calls `preventDefault()` before your `onSubmit`; `NativeSelect` wraps the real `<select>` element, not a custom listbox — for a fully custom dropdown see `@nebula-lab/headless`'s `Select`).

### 👁️ Visibility

`Portal`, `Presence`, `Overlay` — SSR-safe portal rendering, an exit-animation-aware presence state machine (waits for `animationend`/`transitionend` before unmounting), and a bare `fixed inset-0` overlay layer with zero color/opacity of its own.

### 📍 Positioning

`Popper` / `PopperAnchor` / `PopperContent` — side/align/offset placement, collision-flip, and viewport clamping for anchor-positioned surfaces (popovers, menus, tooltips), built from scratch with no external dependency. Also exports a pure `computePosition` function and `usePopperContext` for pushing a virtual anchor (any object with `getBoundingClientRect()`) into `Popper`'s context.

### 🖼️ Media

`Image` — an unstyled polymorphic `img` wrapper (no load/error tracking — see `@nebula-lab/react-ui`'s `Avatar` for that).

### 🔗 Composition

`Primitive` — a polymorphic component supporting the `as` prop (tag swap) and `asChild` (via `Slot`, merges props/ref/className/style onto a single child instead of adding a wrapper element). `Slot` / `Slottable` back `asChild` everywhere in the library. `createContextScope` builds scoped React contexts for compound components (used throughout `@nebula-lab/headless`).

### 📡 Observers

Note: the `ResizeObserver`/`IntersectionObserver`/`MutationObserver` hooks (`useResizeObserver`, `useIntersectionObserver`, `useMutationObserver`) live in `@nebula-lab/hooks`, not here — `primitives` has zero in-workspace dependencies by design, so observer *hooks* belong one layer up. Components in this package that need equivalent behavior (`FocusScope`, `DismissibleLayer`) implement it locally instead of importing across the boundary.

### 🎭 Interaction

Focus management (`FocusScope`, `RovingFocusGroup`), dismissible-layer patterns (`DismissibleLayer`), and overlay detection (`Presence`, `Portal`) compose to build dialogs, popovers, menus, and tooltips without pulling in a separate headless library.

## Example

```tsx
import { Box, Flex, Stack, Text, Heading } from '@nebula-lab/primitives';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box as="section" className="rounded-lg border p-6">
      <Stack gap={4}>
        <Heading level={3}>{title}</Heading>
        <Flex direction="col" gap={2}>
          <Text>{children}</Text>
        </Flex>
      </Stack>
    </Box>
  );
}
```

## `Primitive` and polymorphism

Every component in this package is (directly or indirectly) `Primitive` with a resolved default tag:

```tsx
import * as React from 'react';
import { Primitive } from '@nebula-lab/primitives/primitive';
import type { PolymorphicComponentPropsWithRef } from '@nebula-lab/primitives/types';

type BoxProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<E>;

const Box = React.forwardRef(
  <E extends React.ElementType = 'div'>({ as, ...props }: BoxProps<E>, forwardedRef: React.Ref<unknown>) => (
    <Primitive as={as ?? 'div'} {...props} ref={forwardedRef} />
  ),
) as unknown as <E extends React.ElementType = 'div'>(
  props: BoxProps<E>,
) => React.ReactElement | null;
```

`as` swaps the rendered tag (`<Box as="section">`); `asChild` merges onto a single child via `Slot` instead (`<Box asChild><a href="/">...</a></Box>`) — no extra DOM node, and event handlers/`className`/`style`/`ref` compose rather than override.

## Import

```ts
// barrel
import { Slot, Primitive, Box, Flex, Button, cn } from '@nebula-lab/primitives';

// or per-component subpath (identical runtime code, just explicit — and what
// tsup's per-entry build + the package.json `exports` map are keyed on)
import { Slot } from '@nebula-lab/primitives/slot';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { cn } from '@nebula-lab/primitives/cn';
```

## Conventions

One module per folder (`src/<name>/<name>.ts(x)` + `index.ts` barrel) — see `component-library-architecture.md` §9.1 at the repo root. Package `index.ts` and every folder's `index.ts` are re-exports only, no logic. `primitives` has no in-workspace dependencies — not even `@nebula-lab/utilities` or `@nebula-lab/hooks` — so small pieces of logic (focusable-element queries, outside-click detection) are duplicated locally rather than imported, keeping this package installable standalone.

## Scripts

```
pnpm --filter @nebula-lab/primitives build      # tsup -> dist (ESM + .d.ts)
pnpm --filter @nebula-lab/primitives dev        # tsup --watch
pnpm --filter @nebula-lab/primitives typecheck  # tsc --noEmit
```

## API reference

Every component here ships with a live Storybook entry (controls, source, interaction tests) — that's the authoritative API reference, not this README: **https://tripathirajan.github.io/nebula/**

## Contributing

See the [monorepo's CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT
