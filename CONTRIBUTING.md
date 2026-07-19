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

**Always dispatch this workflow against the `release` branch, never `main`.** `main`'s branch protection requires a PR review for every push, which `github-actions[bot]` can't satisfy — the workflow's own version-bump commit would be rejected (`GH006: Protected branch update failed`). `release` has no protection rule, so the bot can commit and push its version bumps/tags directly there.

### Cutting a new release

1. Bring `release` up to date with everything merged into `main` since the last release:
   ```bash
   git checkout release
   git pull
   git merge main
   git push
   ```
2. Trigger the workflow against `release`:
   ```bash
   gh workflow run "Publish Package" --ref release -f bump=prerelease -f preid=beta -f tag=beta
   ```
   (or `bump=patch`/`minor`/`major` with `tag=latest` for a real, non-prerelease release once the library is ready for one).
3. **Don't trust a green checkmark alone** — verify the actual published content, not just that the workflow succeeded:
   ```bash
   curl -s "https://registry.npmjs.org/@nebula-lab%2Fhooks" | jq '.["dist-tags"], (.versions | keys)'
   ```
   and spot-check that the newly-published version's `fileCount`/`unpackedSize` look like a real package (hundreds of files, hundreds of KB+), not a handful of files and a few KB — an empty/broken publish has looked identical to a successful one in this workflow's own logs before.
4. `release` now has the version-bump commit the bot made — merge it back into `main` so `main`'s `package.json` files don't drift out of sync with what's actually published:
   ```bash
   git checkout main
   git merge release
   git push
   ```
   (`main`'s protection allows a normal PR-based merge here — this is a regular push-to-a-feature-branch-then-PR flow, not the bot pushing directly.)

### Hotfixes

For an urgent fix that needs to ship without waiting for `main`'s next full sync into `release`:

1. Branch off `release` (not `main`): `git checkout -b hotfix/<name> release`.
2. Make the minimal fix, verify it (`pnpm typecheck && pnpm lint && pnpm test && pnpm build`).
3. Merge (via PR, following the normal branch protection on whichever base you target) into **both** `release` (to actually ship it) and `main` (so the fix isn't lost the next time `main` gets merged into `release` — otherwise a subsequent `release` sync could silently revert it).
4. Publish from `release` following the steps above.
