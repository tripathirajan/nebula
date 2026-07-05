---
name: new-component
description: Scaffold a new nebula component (primitive, styleless, react-ui, or react-ui-blocks) with the correct file-per-component folder structure, barrel exports, package.json exports-map entry, and tsup entry point. Use whenever adding a component to any packages/* in the nebula monorepo, or when asked to "add a component", "scaffold X", "create a new primitive/styleless component", etc.
---

# new-component

Scaffolds one nebula component following the repo's non-negotiable convention (see `AGENTS.md` and `component-library-architecture.md` §9.1): one folder per component, barrel-only `index.ts` files, no god-files.

## Before scaffolding

1. Ask (or infer from context) which layer the component belongs in: `primitives`, `styleless`, `react-ui`, or `react-ui-blocks`.
2. Check `packages/<layer>/src/` to confirm it doesn't already exist under a different name.
3. Check the target layer only depends on layers below it (`utilities` -> `hooks` -> `primitives` -> `styleless` -> `react-ui` -> `react-ui-blocks`) -- don't import from a higher layer.

## Folder structure to create

For a component named `foo-bar` in layer `<layer>`:

```
packages/<layer>/src/foo-bar/
  foo-bar.tsx            # the component itself
  foo-bar.types.ts       # only if props are non-trivial; otherwise inline in foo-bar.tsx
  use-foo-bar.ts         # logic hook, only if the component has non-trivial internal state/logic
  foo-bar.stories.tsx    # Storybook story with at least a default + a `play` interaction test
  foo-bar.test.tsx       # Vitest + Testing Library (+ vitest-axe where meaningful) -- see packages/primitives/src/button/button.test.tsx for the pattern
  index.ts               # re-export only: `export { FooBar } from './foo-bar';`
```

If the component has sub-parts (e.g. `Dialog` -> `DialogTrigger`, `DialogContent`, ...), each sub-part gets its own file inside the same folder (`dialog-trigger.tsx`, `dialog-content.tsx`, ...), composed via a shared context created with `createContextScope` (see `packages/primitives/src/create-context-scope`), and all re-exported from the folder's `index.ts`.

## Component implementation checklist

- Named export, `forwardRef`, typed via `PrimitivePropsWithRef<'tag'>` (fixed tag) or `PolymorphicComponentPropsWithRef<E>` (needs `as`) from `@nebula/primitives`.
- Renders through `Primitive` (from `@nebula/primitives/primitive`) rather than a raw JSX tag, passing `as="tag"`, and supports `asChild` where tag flexibility makes sense.
- Controlled + uncontrolled support (`value`/`defaultValue` + `onValueChange`) if it holds state -- use `useControllableState` from `@nebula/hooks`.
- State reflected via `data-state` / `data-disabled` / `data-orientation` attributes, not conditional class toggling.
- If interactive: full keyboard support per its WAI-ARIA APG pattern, `:focus-visible` ring, correct `role`/`aria-*` attributes.
- Styled components (`react-ui` layer and above) use `cn()` from `@nebula/primitives`, never hardcoded classes/colors -- pull from this package's own tokens (`@nebula/react-ui/tokens`, since `react-ui` owns tokens/theming), and build on the matching `@nebula/styleless` component where one exists rather than wrapping raw `Primitive` directly.
- Add TSDoc with an `@example` block on every exported symbol.

## Wiring it in

1. Add `export * from './foo-bar';` to `packages/<layer>/src/index.ts`.
2. Add a subpath entry to `packages/<layer>/package.json`'s `exports` map, mirroring the existing entries (types/import/require pointing at `./dist/foo-bar/index.*`).
3. Add an entry to `packages/<layer>/tsup.config.ts`'s `entry` object: `'foo-bar/index': 'src/foo-bar/index.ts'`.
4. If this is the first component in a brand-new package, also scaffold `package.json`, `tsconfig.json`, and `tsup.config.ts` for that package following `packages/primitives` as the template, and add it to `tsconfig.base.json`'s `paths`, the root `tsconfig.json`'s `references`, and `eslint.config.mjs`'s layering blocks.

## After scaffolding

- Update the status table in `AGENTS.md` if this changes a package from "not started" to "in progress" or adds a notable component.
- Run `pnpm --filter @nebula/<layer> typecheck`, `pnpm --filter @nebula/<layer> lint`, and `pnpm --filter @nebula/<layer> test` before considering the component done (if the sandbox has registry access; otherwise flag that this needs to be run locally).
