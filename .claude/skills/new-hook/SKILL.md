---
name: new-hook
description: Scaffold a new React hook in packages/hooks with the correct file-per-hook folder structure, barrel exports, package.json exports-map entry, and tsup entry point. Use whenever adding a hook to the nebula monorepo, or when asked to "add a hook", "scaffold useX", "create a new hook", etc.
---

# new-hook

Scaffolds one hook in `@nebula-lab/hooks`, following the same file-per-unit + barrel + subpath-export convention `new-component` applies to components (see `AGENTS.md`'s "File-per-component convention" and `ARCHITECTURE.md`).

## Before scaffolding

1. Check `packages/hooks/src/` (and its `README.md`) to confirm an equivalent hook doesn't already exist under a different name.
2. Confirm it actually belongs in `hooks`, not `primitives`: per `AGENTS.md`'s layer-placement decision tree, a hook is "zero DOM/JSX of its own — just state + event wiring a consumer attaches to *any* markup shape." If it renders DOM or is tightly coupled to one component's markup, it's a `primitives` component instead, not a hook.
3. `packages/hooks` has **zero in-workspace dependencies** — not even `@nebula-lab/utilities`, by explicit design (see `packages/hooks/README.md`'s "Note on `@nebula-lab/utilities`"). If the new hook needs logic that overlaps with an existing utility, duplicate the logic locally with a comment pointing at the utilities equivalent — don't import across.

## Folder structure to create

For a hook named `use-foo-bar`:

```
packages/hooks/src/use-foo-bar/
  use-foo-bar.ts   # the hook itself
  index.ts         # re-export only: `export { useFooBar } from './use-foo-bar';`
```

No `.types.ts`/`.stories.tsx` here — hooks aren't rendered, so there's nothing for Storybook to show. No `.test.ts` either as a *hard* requirement — this package currently has no test files at all (confirmed via `packages/hooks/src`), so match that precedent rather than introducing the first one unprompted; add one only if asked to.

## Hook implementation checklist

- Named export, `function useFooBar(...)` (not an arrow-function `const`, matching every existing hook in this package).
- Params: a single destructured options object typed via its own `interface UseFooBarParams { ... }` (or `Options`) when there's more than one or two params, matching `useControllableState`'s pattern — not a long positional-argument list.
- **Full TSDoc on the function itself**: a prose description, one `@param` tag per param (or per destructured field, e.g. `@param params.prop - ...`) and a `@returns` tag — this package's docs (and the generated `packages/hooks/API_DOC.md`) are extracted directly from these tags, so undocumented params/returns show up as gaps in that generated doc.
- Add an `@example` block showing a realistic call site.
- If the hook holds state that a consumer might want to control, build it on `useControllableState` (from `../use-controllable-state/use-controllable-state`) rather than a bare `useState`, matching the controlled/uncontrolled convention every stateful primitive follows.

## Wiring it in

1. Add `export * from './use-foo-bar';` to `packages/hooks/src/index.ts`.
2. Add a subpath entry to `packages/hooks/package.json`'s `exports` map:
   ```json
   "./use-foo-bar": {
     "types": "./dist/use-foo-bar/index.d.ts",
     "import": "./dist/use-foo-bar/index.js"
   }
   ```
3. Add an entry to `packages/hooks/tsup.config.ts`'s `entry` object: `'use-foo-bar/index': 'src/use-foo-bar/index.ts'`.

## After scaffolding

- Add the hook to the bulleted list in `packages/hooks/README.md`'s "What's here" section.
- Regenerate `packages/hooks/API_DOC.md` (`node scripts/generate-api-docs.mjs`) so the new hook's real signature shows up there rather than being hand-typed.
- Run `pnpm --filter @nebula-lab/hooks typecheck` and `pnpm --filter @nebula-lab/hooks lint` (if the sandbox has registry access; otherwise flag that this needs a local run).
