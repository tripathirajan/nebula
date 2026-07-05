# AGENTS.md — nebula

Instructions for any AI coding agent (Claude, Codex, Cursor, etc.) working in this repo. Read `component-library-architecture.md` for the full rationale and inventory; this file is the condensed, load-bearing rule set — follow it even where the architecture doc is more discursive.

## What this is

A composable React UI platform: design tokens → styleless (unstyled, ARIA-complete) components → hooks → a Tailwind-powered styled design system. Ships as independently-versioned `@nebula/*` packages in a pnpm + Nx monorepo.

## Current state (keep this section accurate as packages land)

| Package | Status |
| --- | --- |
| `packages/utilities` | Done for now: `clamp`, `debounce`, `throttle`, `deepMerge`, `isHTMLElement`, `isFocusable`. No workspace deps — bottom of the graph. |
| `packages/hooks` | Done for now: `useControllableState`, `useClickOutside`, `useMediaQuery`, `useScrollLock`, `useFocusTrap`, `useResizeObserver`, `useIntersectionObserver`, `useMutationObserver`, `useLocalStorage`, `useDebounce`, `useId`, `useBoolean`, `useToggle`, `useStableCallback`, `useEventListener`, `usePrevious`, `useMounted`. Intentionally has no dependency on `@nebula/utilities` (see its README) or any other workspace package. |
| `packages/primitives` | Full low-level layer, zero in-workspace deps. **Composition:** `Primitive` (truly polymorphic — `as` + `asChild`, via `PolymorphicComponentPropsWithRef<E>`), `Slot`/`Slottable`. **Layout:** `Box`, `Flex`, `Grid`, `Stack`, `Inline`, `Center`, `Container`, `AspectRatio`. **Text:** `Text`, `Heading`, `Paragraph`, `Code`, `Pre`, `Link`. **Accessibility:** `VisuallyHidden`, `FocusScope`, `DismissableLayer`, `Boundary`, `RovingFocusGroup`/`FocusItem`. **Form:** `Button`, `Input`, `Textarea`, `Label`, `Form`. **Visibility:** `Portal`, `Presence`, `Overlay`. Plus `cn`, `composeRefs`, `composeEventHandlers`, `createContextScope`. See `packages/primitives/README.md` for the full feature breakdown. `packages/react-ui`'s `Button` builds on `primitives`' `Button`, not raw `Primitive`. |
| `packages/styleless` | **Renamed from `packages/headless`** — same package, clearer name ("styleless" says directly what this layer guarantees; "headless" is overloaded jargon outside UI-library circles). `Tabs`/`TabList`/`Tab`/`TabPanel` (full WAI-ARIA Tabs pattern — roving tabindex, automatic/manual activation, scoped context), `Checkbox` (tri-state, hidden-native-input form participation), `Switch`, `RadioGroup`/`RadioGroupItem` (reuses `primitives`' `RovingFocusGroup`/`FocusItem` instead of hand-rolling roving-tabindex again), `Accordion`/`AccordionItem`/`AccordionHeader`/`AccordionTrigger`/`AccordionContent` (`type="single"`\|`"multiple"`, arrow-key nav via `RovingFocusGroup`/`FocusItem`, panel wrapped in `primitives`' `Presence` for animatable expand/collapse). `Dialog`, `Popover`, `Tooltip` not yet built. |
| `packages/react-ui` | **Absorbed the former `packages/theme`** — no other package ever needed tokens/theming (primitives/styleless are deliberately unstyled), so keeping them split was a package boundary with one real consumer. Now owns: `Button` (`cva` variants `primary`/`secondary`/`danger` × `sm`/`md`/`lg`, `loading` state) **and** the 3-layer token system (`tokens/primitive.ts`/`semantic.ts`/`component.ts` compiled by `tokens/generate.ts` into a checked-in `src/theme.css`, plus `tokens/contrast-audit.ts` — see `CONTRAST_AUDIT.md`) **and** `ThemeProvider`/`useTheme` (light/dark/system, persisted via `@nebula/hooks` — now a `react-ui` dependency). Everything else in `component-library-architecture.md` §4 not yet built. |
| `packages/react-ui-blocks` | **Merged from the former `sections` + `layouts` packages** — both had the identical dependency shape (`react-ui`, top of the graph) so the split was a package boundary without an architectural reason; also deliberately domain-neutral, not ecommerce- or any other vertical-specific (a user asked for an ecommerce-flavored "react-ui-store" layer; declined in favor of this, since a dashboard shell/theme switcher is just as useful to e.g. an expense-tracker app). Has `ThemeSwitcher` (light/dark/system toggle on `react-ui`'s `Button` + `useTheme`) and `AppLayout` (`ThemeProvider` + header w/ `ThemeSwitcher` + `Primitive.main` + `#nebula-portal-root` div). Still to build: `LoginForm`, `TransactionForm`, etc. (former §5), `DashboardLayout`, `AuthLayout`, `SettingsLayout` (former §6) — see `packages/react-ui-blocks/README.md`. |
| `apps/playground` | **Removed.** Used to be a Vite + React dev harness that smoke-tested every package in one page; deleted since it duplicated what Storybook already does per-component, and having two dev entry points was extra maintenance for no real benefit. Storybook is now the only dev harness — its Tailwind wiring (`@tailwindcss/vite` + `.storybook/tailwind.css`, importing `@nebula/react-ui/theme.css`) lives directly under `.storybook/` instead of depending on a demo app for it. If a real example app is wanted later (e.g. the `apps/budget-tracker` idea in `component-library-architecture.md`), add it fresh rather than resurrecting this. |
| Storybook | Configured at repo root (`.storybook/`), Vite builder, `addon-a11y` + `addon-essentials` + `addon-interactions`. Stories glob: `packages/*/src/**/*.stories.tsx`. Every component built so far has at least one story with a `play` interaction test. `viteFinal` in `.storybook/main.ts` registers `@tailwindcss/vite` directly (Storybook's Vite instance doesn't inherit any app's `vite.config.ts`). |
| Testing (Vitest/RTL/axe) | Wired: root `vitest.config.ts` (jsdom, single config for the whole workspace) + `vitest.setup.ts` (`@testing-library/jest-dom` + `vitest-axe` matchers). Tests exist for `primitives` (`Primitive`, `Button`, `Input`, `Label`, `FocusScope`, `DismissableLayer`, `RovingFocusGroup`/`FocusItem`, `Presence`, `VisuallyHidden`), `styleless` (`Tabs`), and `react-ui` (`Button`) — each includes an axe a11y check where rendering a real DOM tree makes that meaningful. Other packages don't have a `test` script yet since they have no test files; add one (see `packages/primitives/package.json` for the pattern) the first time a package gets tests. Run `pnpm test` (whole workspace) or `pnpm --filter @nebula/primitives test` (scoped). **Unverified** — see Sandbox note in `CLAUDE.md`; run `pnpm install && pnpm test` locally before trusting this. |
| Changesets / publishing | Not yet wired. |

Before claiming a component "already exists," check the actual `packages/*/src` tree — don't trust this table blindly if it looks stale, and update it in the same PR that adds a package.

## Non-negotiable architecture rules

1. **Layer dependency direction is one-way:** `utilities` → `hooks` → `primitives` → `styleless` → `react-ui` → `react-ui-blocks`. A lower layer must never import from a higher one. `eslint.config.mjs` enforces this per-package via `no-restricted-imports`; add a new block there for each new package rather than disabling the rule.
2. **Everything renders through `Primitive` and supports `asChild` via `Slot`** where DOM-tag flexibility makes sense. No component hardcodes its rendered tag.
3. **Uncontrolled by default, controllable when needed** — `value`/`defaultValue` + `onValueChange`, never a bare `onChange`-only API for stateful primitives.
4. **Every interactive primitive follows its WAI-ARIA APG pattern**: correct role, full keyboard support, visible `:focus-visible` ring, `aria-*` wiring, `data-state`/`data-disabled`/`data-orientation` attributes instead of JS class toggling.
5. **Style only via Tailwind utility classes + `cn()`** (`clsx` + `tailwind-merge`). Never hardcode colors — everything themable through the token layers in `packages/react-ui/src/tokens`.
6. **Nested instances of the same compound component must not collide.** Use `createContextScope` (see `packages/primitives/src/create-context-scope`) for any compound component's shared state, not a bare module-level `React.createContext`.

## File-per-component convention (non-negotiable)

One component (and its subparts) per folder — never a god-file:

```
packages/<pkg>/src/
  <component-name>/
    <component-name>.tsx
    <component-name>.types.ts       # if the prop types are non-trivial
    use-<component-name>.ts          # logic hook, kept out of the component file
    <component-name>.stories.tsx
    <component-name>.test.tsx        # once Vitest is wired
    <component-name>.a11y.test.tsx   # once Vitest is wired
    index.ts                          # re-export only, zero logic
  index.ts                            # package barrel: export * from './<component-name>'; ...
```

`index.ts` files are barrels only. Each package's `package.json` sets `"sideEffects": false` and an `exports` map with a subpath per component (see `packages/primitives/package.json` for the pattern) — bundlers tree-shake per component this way. `tsup.config.ts` in each package lists one entry per component/module, never a single bundled entry.

## Commands

```bash
pnpm install                 # from repo root — this sandbox has no npm registry access, run locally
pnpm dev                     # nx run-many -t dev, all packages in watch mode
pnpm build                   # nx run-many -t build
pnpm typecheck               # nx run-many -t typecheck
pnpm lint / pnpm lint:fix
pnpm format / pnpm format:check
pnpm test                    # vitest run, whole workspace (see root vitest.config.ts)
pnpm test:watch              # vitest, whole workspace, watch mode
pnpm storybook               # http://localhost:6006
pnpm --filter @nebula/primitives <script>   # scope any script to one package
```

## Adding a new component

Use the `new-component` skill (`.claude/skills/new-component/SKILL.md`) to scaffold the folder structure above with the correct boilerplate rather than hand-copying an existing component and forgetting to update its barrel/exports map.

## When in doubt

Prefer matching an existing pattern in `packages/primitives` over inventing a new one. If the architecture doc and the actual code disagree, the code plus this file win — flag the discrepancy rather than silently resolving it either way.
