# Contributing to nebula

nebula is a pnpm + Nx monorepo. This doc covers the workflow for changing code here — for what each package actually contains, see its own `README.md`; for the layering rules and current build status, see `AGENTS.md`.

## Setup

```bash
pnpm install
```

Requires Node 24 and pnpm 9 (see `package.json`'s `packageManager` field — `corepack enable` will pick it up automatically).

## Everyday commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs every package's `dev` target (watch-mode builds) in parallel. |
| `pnpm build` | Builds every package (`nx run-many -t build`). |
| `pnpm typecheck` | Typechecks every package. |
| `pnpm lint` | Lints the whole workspace, zero warnings allowed. |
| `pnpm test` | Runs the full Vitest suite once. |
| `pnpm test:watch` | Vitest in watch mode. |
| `pnpm storybook` | Local Storybook dev server at `localhost:6006` — the live component gallery and API reference for every styled/headless component. |
| `pnpm build-storybook` | Static Storybook build (`storybook-static/`) — what CI deploys to GitHub Pages. |

Run a command for a single package with `pnpm --filter @nebula-lab/<pkg> <command>` (e.g. `pnpm --filter @nebula-lab/react-ui test`).

## Adding a new component

Use the `new-component` skill (if you're working with Claude Code) or follow the same convention by hand: one folder per component under the right layer's `src/`, a barrel-only `index.ts`, a subpath entry in that package's `package.json` `exports` map and `tsup.config.ts`. See `component-library-architecture.md` §2–§6 for which layer (`primitives` / `headless` / `styleless` / `react-ui` / `react-ui-blocks`) a given component belongs in, and `AGENTS.md`'s status table for what already exists.

Every component needs:
- A named export, `forwardRef`, typed via `PrimitivePropsWithRef`/`PolymorphicComponentPropsWithRef` from `@nebula-lab/primitives`.
- A `.stories.tsx` with at least a default story and a `play` interaction test.
- A `.test.tsx` (Vitest + Testing Library, `vitest-axe` where meaningful).
- State reflected via `data-state`/`data-disabled`/`data-orientation` attributes rather than conditional class toggling, and full keyboard support per its WAI-ARIA APG pattern if it's interactive.

## Regenerating design tokens (react-ui only)

This is an internal workflow for editing `@nebula-lab/react-ui`'s own token source — not something a package consumer ever needs to run. If you're changing a color, radius, or other design token:

1. Edit `packages/react-ui/src/tokens/semantic.ts` (light/dark mappings) or `tokens/component.ts` (per-component roles) — never hand-edit `tokens/primitive.ts` casually, it's the raw OKLCH palette.
2. Regenerate the compiled stylesheet:
   ```bash
   pnpm --filter @nebula-lab/react-ui generate-tokens
   ```
   This overwrites `packages/react-ui/src/theme.css` — never hand-edit that file directly, it's generated output.
3. Check contrast on any color change:
   ```bash
   pnpm --filter @nebula-lab/react-ui contrast-audit
   ```
   See `packages/react-ui/CONTRAST_AUDIT.md` for the current pass/fail state of every semantic color pairing.

## Before opening a PR

Run the full verification sweep — this is what CI checks:

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

Then, for anything visual, start Storybook and check the change live — type checking and tests verify correctness, not that a component actually looks/behaves right in a browser.

## Workflow

- Branch off `main`, open a PR, merge once CI is green.
- Follow the existing commit message style (`type(scope): summary`, e.g. `feat(react-ui): add Backdrop component`).
- Don't hand-edit generated files (`theme.css`, anything under `dist/`) or the lockfile — let the relevant script/`pnpm install` regenerate them.

## Publishing (maintainers only)

Releases go out via the **Publish Package** GitHub Actions workflow (`workflow_dispatch`, manual trigger only) — it versions every package independently with Nx, builds, and publishes to npm under the `@nebula-lab` scope. Not something a regular contributor needs to touch.
