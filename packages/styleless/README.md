# @nebula-lab/styleless

Reusable UI components with a complete, semantic API — but zero visual opinion. Composes `@nebula-lab/primitives` + `@nebula-lab/headless`; styled by `@nebula-lab/react-ui`, which wraps each of these and adds Tailwind classes/variants/tokens on top.

This is the newest layer in the pipeline (`primitives → headless → styleless → react-ui → react-ui-blocks`), confirmed via the project owner's decision guide:

```
1. Is it a low-level DOM abstraction?                                        → Primitive
2. Does it solve reusable interaction/state/a11y/keyboard/focus/positioning?  → Headless
3. Is it a reusable UI component composing primitives/headless, unstyled?     → Styleless
4. Does it add the Nebula design system (Tailwind, variants, themes)?        → React UI
```

See `LAYER_TAXONOMY.md` (repo root) for the full ~50-component extraction plan — every component tagged **[extract]** there is currently styled directly in `@nebula-lab/react-ui` and needs an unstyled version factored out into this package. Only `Button` has been extracted so far.

## What's here

- `Button` — wraps `@nebula-lab/primitives`' bare `Button` and adds real `loading` semantics (`aria-busy`, `data-loading`, forced `disabled`) — no Tailwind classes, no `cva` variants. `@nebula-lab/react-ui`'s `Button` wraps this one and adds only styling.

## Import

```tsx
import { Button } from '@nebula-lab/styleless';
// or per-component subpath
import { Button } from '@nebula-lab/styleless/button';
```

```tsx
<Button onClick={() => {}}>Click me</Button>
<Button loading>Saving…</Button>
```
