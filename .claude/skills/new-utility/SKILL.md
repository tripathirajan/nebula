---
name: new-utility
description: Scaffold a new framework-agnostic helper function in packages/utilities with the correct file-per-utility folder structure, barrel exports, package.json exports-map entry, and tsup entry point. Use whenever adding a utility to the nebula monorepo, or when asked to "add a utility", "scaffold a helper function", "create a new utility", etc.
---

# new-utility

Scaffolds one function in `@nebula-lab/utilities`, following the same file-per-unit + barrel + subpath-export convention `new-component`/`new-hook` apply one layer up.

## Before scaffolding

1. Check `packages/utilities/src/` (and its `README.md`) to confirm an equivalent helper doesn't already exist.
2. Confirm it actually belongs in `utilities`, not `hooks`: `utilities` is **framework-agnostic** — zero React, zero DOM dependency beyond the couple of existing DOM-*predicate* helpers (`isFocusable`, `isHtmlElement`). If the new function needs a React hook (`useState`/`useEffect`/refs) or is meant to be called from inside a component's render, it belongs in `packages/hooks` instead.
3. `packages/utilities` has **zero in-workspace dependencies** (bottom of the layer graph alongside `hooks`, with no cross-dependency between the two — see `ARCHITECTURE.md`).

## Folder structure to create

For a utility named `foo-bar`:

```
packages/utilities/src/foo-bar/
  foo-bar.ts   # the function itself
  index.ts     # re-export only: `export { fooBar } from './foo-bar';`
```

No `.stories.tsx` (nothing to render). No `.test.ts` as a *hard* requirement — this package currently has no test files at all (confirmed via `packages/utilities/src`); match that precedent rather than introducing the first one unprompted.

## Function implementation checklist

- Named export, plain function declaration (`function fooBar(...) { ... }`), not a default export, not an arrow-function `const` — matches every existing utility (`clamp`, `debounce`, `deepMerge`, ...).
- Fully typed parameters and return type — no `any`.
- **Full TSDoc on the function**: a prose description, one `@param` tag per parameter, and a `@returns` tag — `packages/utilities/API_DOC.md` is generated directly from these, so an undocumented parameter shows up as a real gap in that doc, not just a missing comment.
- Add an `@example` block with 2-3 concrete input/output calls, matching `clamp`'s doc comment style.
- Keep it a pure function where the domain allows it (no hidden shared state, no module-level mutable variables) — `debounce`/`throttle` are the deliberate exceptions (they return a stateful wrapped function by nature), not the pattern to copy by default.

## Wiring it in

1. Add `export * from './foo-bar';` to `packages/utilities/src/index.ts`.
2. Add a subpath entry to `packages/utilities/package.json`'s `exports` map:
   ```json
   "./foo-bar": {
     "types": "./dist/foo-bar/index.d.ts",
     "import": "./dist/foo-bar/index.js"
   }
   ```
3. Add an entry to `packages/utilities/tsup.config.ts`'s `entry` object: `'foo-bar/index': 'src/foo-bar/index.ts'`.

## After scaffolding

- Add the function to `packages/utilities/README.md`'s function list.
- Regenerate `packages/utilities/API_DOC.md` (`node scripts/generate-api-docs.mjs`) so the new function's real signature shows up there rather than being hand-typed.
- Run `pnpm --filter @nebula-lab/utilities typecheck` and `pnpm --filter @nebula-lab/utilities lint` (if the sandbox has registry access; otherwise flag that this needs a local run).
