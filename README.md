# nebula

A composable React UI platform: design tokens → headless (behavior-only, ARIA-complete) components → styleless (unstyled but structurally complete) components → hooks → a Tailwind-powered styled design system. Ships as independently-versioned `@nebula-lab/*` packages in a pnpm + Nx monorepo.

## Layers

Each package is a separate layer with a one-way dependency direction — a lower layer never imports from a higher one (enforced via ESLint):

```
utilities → hooks → primitives → headless → styleless → react-ui → react-ui-blocks
```

| Package | What it is |
| --- | --- |
| [`@nebula-lab/utilities`](./packages/utilities) | Framework-agnostic helpers (`clamp`, `debounce`, `throttle`, `deepMerge`, DOM predicates). No dependencies on anything else in this repo. |
| [`@nebula-lab/hooks`](./packages/hooks) | Reusable React hooks (`useControllableState`, `useFocusTrap`, `useLocalStorage`, observers, ...). No dependency on `utilities` or any other workspace package, by design. |
| [`@nebula-lab/primitives`](./packages/primitives) | Unstyled, polymorphic low-level building blocks — `Primitive`/`Slot` (the `as`/`asChild` pattern everything else is built on), layout (`Box`/`Flex`/`Grid`/`Stack`/...), text, accessibility (`FocusScope`/`DismissibleLayer`/`RovingFocusGroup`/...), form, and visibility (`Portal`/`Presence`/`Overlay`) primitives. Zero in-workspace dependencies. |
| [`@nebula-lab/headless`](./packages/headless) | Behavior-only, ARIA-complete compound components (`Tabs`, `Dialog`, `Combobox`, `Checkbox`, `Switch`, `RadioGroup`, ...) — solves interaction/state/a11y/keyboard/focus/positioning, no styling opinions at all. (Renamed from this repo's earlier, differently-scoped `@nebula-lab/styleless`.) |
| [`@nebula-lab/styleless`](./packages/styleless) | **Just started.** The new middle layer: reusable UI components (`Button`, `Input`, `Card`, `Table`, ...) that compose `primitives`/`headless` with a complete, semantic API but zero visual opinion. `Button` is the first extraction; see `LAYER_TAXONOMY.md` for the full remaining plan. |
| [`@nebula-lab/react-ui`](./packages/react-ui) | Tailwind-styled components (atoms) built on `primitives` + `headless` (and, once extracted, `styleless`), plus the 3-layer design token system and `ThemeProvider`/`useTheme` (light/dark/system) — this package absorbed the former standalone `@nebula-lab/theme` package, since nothing else in the workspace needed tokens/theming. |
| [`@nebula-lab/react-ui-blocks`](./packages/react-ui-blocks) | Domain-neutral, ready-to-use screens/modules built from `react-ui` — page shells, theme switchers, forms, dashboards, auth flows (`ThemeSwitcher`, `AppLayout`, `LoginForm`, `DashboardLayout`, ...). Top of the dependency graph. |

Every package has its own README with more detail. See `AGENTS.md` for the full non-negotiable architecture rules (layering, file-per-component convention, style guide) and its status table for exactly what's built vs. still pending — that table is the source of truth, not this file.

## Quickstart

```bash
pnpm install                 # from the repo root
pnpm dev                     # nx run-many -t dev, all packages in watch mode
pnpm storybook               # http://localhost:6006 — isolated component review
pnpm build                   # nx run-many -t build
pnpm typecheck               # nx run-many -t typecheck
pnpm test                    # vitest run, whole workspace
pnpm lint / pnpm lint:fix
pnpm format / pnpm format:check
```

Scope any script to a single package with `pnpm --filter @nebula-lab/<package> <script>`.

## Custom theming

Every color/radius/size value ships as a CSS custom property (`--color-primary`, `--button-primary-bg`, `--radius-button`, ...) using OKLCH colors and a DaisyUI-style vocabulary, not a hardcoded Tailwind class — consuming apps can override any of them (via `:root`/`.dark`, no rebuild needed), add their own named themes beyond light/dark, or fork the token source entirely. See [`packages/react-ui/README.md`](./packages/react-ui/README.md#custom-theming--color-schemes) for the specifics and trade-offs of each approach.

## Docs

- [`AGENTS.md`](./AGENTS.md) — canonical rules for any agent (human or AI) working in this repo: layering, conventions, current build status, commands.
- [`CLAUDE.md`](./CLAUDE.md) — Claude-Code-specific notes on top of `AGENTS.md` (sandbox limitations, before-you-write-a-component checklist).
- [`component-library-architecture.md`](./component-library-architecture.md) — the original discursive design rationale and full component inventory/roadmap.
- [`STATUS_AND_COMPLIANCE_REPORT.md`](./STATUS_AND_COMPLIANCE_REPORT.md) — build checklist plus a WAI-ARIA/WCAG conformance and international accessibility-law compliance analysis.

## License

MIT
