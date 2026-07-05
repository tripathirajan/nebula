# CLAUDE.md — nebula

This project's full agent instructions live in **`AGENTS.md`** — read it first, it's the canonical rule set (layering, file-per-component convention, current build status, commands). Everything below is Claude-Code-specific on top of that.

## Project instructions (from Cowork project settings)

> A composable React UI platform with design tokens, headless components, hooks, and a Tailwind-powered design system. Cover all the elements.

"Cover all the elements" means: as work continues, every layer in `component-library-architecture.md` §2 (`utilities`, `hooks`, `primitives`, `headless`, `theme`, `ui`, `sections`, `layouts`) should eventually exist with real content — don't let one layer (e.g. `ui`) grow while `theme` or `hooks` stay empty stubs. Check `AGENTS.md`'s status table before starting new work to see what's actually missing.

## Sandbox note

This repo may be edited from a sandboxed environment without npm registry access. If `pnpm install` / `pnpm build` / `pnpm storybook` / `pnpm test` can't actually be run in-session, say so explicitly rather than reporting untested config as verified — hand-authored `package.json`/`tsup.config.ts`/`eslint.config.mjs`/`vitest.config.ts` files should be flagged for a local `pnpm install` + smoke test before being trusted. This applies to the test *files* too (`*.test.tsx`) — they're written to compile and read correctly, but have never actually been executed against a real `vitest` + `jsdom` + `@testing-library/react` install; run `pnpm test` locally and fix whatever a real run surfaces before trusting them as passing.

## Before writing a new component

1. Check `AGENTS.md`'s status table and the real `packages/*/src` tree — don't assume a component is missing (or already exists) without checking.
2. Confirm which layer it belongs in (`primitives` vs `headless` vs `ui` vs `sections` vs `layouts`) using `component-library-architecture.md` §2–§6.
3. Use the `new-component` skill to scaffold it, so the file-per-component + barrel + `exports` map convention is applied consistently.
4. Update `AGENTS.md`'s status table in the same change.

## Style

Match the existing code in `packages/primitives` (JSDoc-style comments explaining *why*, not restating the code; named exports only, no default exports; `type`-only imports where the lint rule requires it).
