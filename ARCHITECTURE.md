# nebula — Architecture

The single source of truth for how this codebase is organized and why. Replaces `component-library-architecture.md`, `LAYER_TAXONOMY.md`, and `COMPONENT_COVERAGE_AUDIT.md` (all now deleted — their still-valid content lives here; their historical "read X as Y" renaming trails and stale in-progress snapshots don't, since the renames are long done and the snapshots are superseded by the generated docs below).

For the condensed, load-bearing rule set (the version an agent should actually follow when in doubt), see `AGENTS.md` — this doc is the fuller rationale behind those rules.

## Core philosophy

1. **Unstyled primitives own behavior + accessibility. Styled components own visuals.** Composite blocks own product/flow logic. Never mix these concerns into one layer.
2. **Everything renders through `Primitive` and supports `asChild` via `Slot`** where DOM-tag flexibility makes sense. No component hardcodes its rendered tag.
3. **Uncontrolled by default, controllable when needed** — `value`/`defaultValue` + `onValueChange`, never a bare `onChange`-only API for stateful components.
4. **Every interactive component follows its WAI-ARIA APG pattern**: correct role, full keyboard support, visible `:focus-visible` ring, `aria-*` wiring, `data-state`/`data-disabled`/`data-orientation` attributes instead of JS class toggling.
5. **Style only via Tailwind utility classes + `cn()`** (`clsx` + `tailwind-merge`). Never hardcode colors or spacing amounts — everything themable through the token layers in `packages/react-ui/src/tokens`. This applies to every styled layer, not just `react-ui` itself — see "A real bug this rule caught" below.
6. **Nested instances of the same compound component must not collide.** Use `createContextScope` (`packages/primitives/src/create-context-scope`) for any compound component's shared state, never a bare module-level `React.createContext`.

### A real bug this rule caught

`primitives`' `Pre`/`Code` used to hardcode `bg-gray-100` directly — a violation of principle #1 (primitives own behavior, not visuals) that nobody had caught because it typechecked fine and looked correct in light mode. The bug: that hardcoded gray had zero dark-mode awareness, so a bare `<Pre>` stayed a fixed light-gray box even when the rest of the app switched themes. Fixed by stripping all Tailwind classes out of the primitives entirely (now pure `Primitive` pass-throughs, same shape as `Box`) and moving 100% of the visual decision — using the same `--code-block-*` tokens `CodeBlock` already uses — into `react-ui`'s wrapper, the only layer that's supposed to own it. Worth remembering as a concrete example of why the rule isn't cosmetic.

## Layered architecture

```
utilities → hooks → primitives → headless → styleless → react-ui → react-ui-blocks
```

A **one-way dependency chain**, enforced two ways: mechanically via `eslint.config.mjs`'s `no-restricted-imports` blocks (one per package boundary — add a new block there for any new package rather than disabling the rule), and verified directly for the current codebase in `LAYER_ARCHITECTURE_MAP.md` (zero reverse-direction imports found anywhere, checked by grepping real `import` statements, not assumed).

| Package | Role | Depends on |
| --- | --- | --- |
| `@nebula-lab/utilities` | Framework-agnostic helpers (`clamp`, `debounce`, `deepMerge`, DOM predicates). | Nothing in-workspace. |
| `@nebula-lab/hooks` | Reusable React hooks (`useControllableState`, `useFocusTrap`, `useLocalStorage`, observers, ...). | Nothing in-workspace — deliberately no dependency on `utilities` either; overlapping logic (e.g. focusable-element queries) is duplicated locally with a comment, not cross-imported, so this package stays installable standalone. |
| `@nebula-lab/primitives` | Unstyled, polymorphic low-level building blocks: `Primitive`/`Slot` (the `as`/`asChild` pattern everything else is built on), layout (`Box`/`Flex`/`Grid`/`Stack`/...), text, accessibility (`FocusScope`/`DismissibleLayer`/`RovingFocusGroup`/...), form, and visibility (`Portal`/`Presence`/`Overlay`) primitives. | `utilities`, `hooks`. |
| `@nebula-lab/headless` | Behavior-only, ARIA-complete compound components (`Dialog`, `Select`, `Combobox`, `Tabs`, `Accordion`, ...) — solves interaction/state/a11y/keyboard/focus/positioning, zero styling opinion. | `primitives`, `hooks`. |
| `@nebula-lab/styleless` | Reusable UI components (`Button`, `Input`, `Avatar`, `DataTable`, `CodeBlock`, ...) that compose `primitives`/`headless` into a complete, semantic API — still zero visual opinion, every part takes a `classNames` prop that `react-ui` supplies. | `primitives`, `hooks`, `headless`. |
| `@nebula-lab/react-ui` | Tailwind-styled components built on the layers below, plus the 3-layer design token system and `ThemeProvider`/`useTheme` (absorbed the former standalone `@nebula-lab/theme` package — nothing else in the workspace ever needed tokens/theming). | `primitives`, `headless`, `styleless`, `hooks`. |
| `@nebula-lab/react-ui-blocks` | Organisms — full page sections/flows (`LoginForm`, `SaasAppHeader`, `ChatWindow`, ...), each shaped by one specific flow's copy/logic. Domain-neutral core plus per-vertical subpaths (`/authentication`, `/dashboard`, `/ecommerce`, ...) — see `BLOCKS_ARCHITECTURE.md` for that package's own internal taxonomy. | `react-ui`. |

**Current status**: every layer above is stable and in active use — `styleless` in particular is **coverage-complete** (not "just started"; that was true early in this project's history but is a common stale claim worth explicitly correcting here). See `AGENTS.md`'s status table for the terse per-package summary, and the three generated docs below for the real, current, verified component-level detail.

## Where the real component inventory lives (generated, not hand-written)

These three docs are regenerated from the actual source tree, not maintained by hand — trust them over any prose description (including this one) if they ever disagree:

- **`COMPONENT_INVENTORY.md`** — every component in all 5 layers, one table per package, with a real usage summary (pulled from each component's own doc comment) and which layer above/below it relates to. Regenerate: `node scripts/generate-component-inventory.mjs`.
- **`LAYER_ARCHITECTURE_MAP.md`** — the verified 1:1 mapping of every `headless`/`styleless` component to its `react-ui` counterpart, computed from real `import` statements. Regenerate: `node scripts/generate-layer-architecture-map.mjs`.
- **`COMPONENT_FAMILIES.md`** — components that are a generic root plus named variants (`Menu` → `ContextMenu`/`DropdownMenu`, `Dialog` → `AlertDialog`/`Drawer`, `Flex` → `Stack`/`HStack`/`Inline`, ...), distinguishing real behavioral variants from pure vocabulary aliases. Manually curated (the "why" needs real reasoning per pair), not regenerated — re-verify the underlying re-export list with the grep commands at its bottom before trusting it after a family changes.

## Layer placement — deciding where a new component goes

Ask these in order:

```
1. Zero DOM/JSX of its own — just state + event wiring a consumer attaches to *any* markup shape?
   └─ Yes → hooks (not even a primitive)

2. Renders DOM, but is either (a) cross-cutting plumbing reused across many unrelated
   widgets, or (b) a single atomic element with no named WAI-ARIA widget pattern of its own?
   └─ Yes → primitives

3. Implements a specific named WAI-ARIA authoring-practice pattern, usually via multiple
   coordinated sub-components (Root/Trigger/Content/Item) sharing scoped context?
   └─ Yes → headless

4. A reusable, complete UI component built on primitives/headless but still carrying
   zero Tailwind/visual opinion?
   └─ Yes → styleless

5. Adds the Nebula design system (Tailwind styles, variants, themes, sizes, colors)?
   └─ Yes → react-ui

6. Assembles multiple react-ui components into a full screen/module shaped by one
   specific flow's copy/logic (not domain-neutral, not reusable across flows)?
   └─ Yes → react-ui-blocks
```

Rules of thumb: **primitives** = "abstracts HTML." **headless** = "solves behavior." **styleless** = "provides a reusable UI API." **react-ui** = "provides Nebula's visual design." **react-ui-blocks** = "assembles a screen."

Worked examples for the two steps people most often get wrong:

- **Step 3 vs. step 4** — `Button`/`Input`/`Card`/`DataTable` have a real, complete structural API worth reusing unstyled, but none of them is itself a named ARIA *widget* pattern the way `Dialog`/`Combobox` are: they either have no interactive state machine at all (`Card`), or their state machine already lives one layer down in `headless` (a `styleless` `Select` shell wraps `headless`'s `Select`/`Listbox` behavior, it doesn't reimplement it). That's the line between step 3 and step 4.
- **Judgment call: a genuinely new widget whose "behavior" is really just state + native semantics** (native `<table>` sort/select, native HTML5 drag-and-drop, CSS-transform slide logic) **rather than a bespoke ARIA pattern** — built directly in `react-ui` today, as an explicit, documented decision each time, not a default: `Carousel`, `DataTable`, `DataGrid`, `Draggable`/`Droppable`/`Sortable`, `MultiSelect`, `Calendar`/`DatePicker`/`DateRangePicker`. Write the same kind of one-paragraph justification if you hit a new case like this — don't silently default anywhere just because something similar landed in `react-ui` before.

Before building anything: check `COMPONENT_INVENTORY.md` and `COMPONENT_FAMILIES.md` first — a plausible-sounding new component is very often already a named variant of something that exists (same test `ContextMenu`/`DropdownMenu`/`Autocomplete`/`TreeView`/`VStack`/`Wrap` already passed).

## File-per-component convention (non-negotiable)

One component (and its subparts) per folder, arranged into category subfolders once a package has enough components to need navigability (see `COMPONENT_INVENTORY.md`'s per-package category breakdown) — never a god-file:

```
packages/<pkg>/src/
  <category>/                       # once a package is large enough — see below
    <component-name>/
      <component-name>.tsx
      use-<component-name>.ts        # logic hook, kept out of the component file if non-trivial
      <component-name>.stories.tsx   # at least a default story + a `play` interaction test
      <component-name>.test.tsx      # Vitest + Testing Library, vitest-axe where meaningful
      index.ts                       # re-export only, zero logic
  index.ts                           # package barrel: export * from './<category>/<component-name>'; ...
```

`index.ts` files are barrels only. Each package's `package.json` sets `"sideEffects": false` and an `exports` map with a subpath per component; `tsup.config.ts` lists one entry per component, never a single bundled entry — bundlers tree-shake per component this way.

**Category subfolders never change a component's public import path.** `tsup`'s `entry` map is a `{ key: sourceValue }` object — the **key** controls the output path (`dist/<name>/index.js`), the **value** is just where the source happens to live. So `@nebula-lab/react-ui/flex` stays exactly that, whether `flex.tsx` lives at `src/flex.tsx` or `src/layout/flex/flex.tsx`. This is what let `react-ui`'s full ~130-component reorg into category folders (and `headless`/`primitives`/`react-ui`'s further reorg into *family* folders — `overlays/menu/{menu,context-menu,dropdown-menu}/`, etc.) happen with zero consumer-facing breakage.

**The one place this needs an extra build step**: `tsc --emitDeclarationOnly` (which produces `.d.ts` files) has no equivalent "entry key" concept — it just mirrors `src/`'s folder structure into `dist/` 1:1. So the moment source moves into nested category/family folders, `tsc`'s declaration output silently diverges from `tsup`'s flat JS output, and `package.json`'s `exports` map only points at the flat path — a real, breaking regression for any TypeScript consumer (silently falls back to `any`), not a cosmetic one. Every package with nested source now runs a `scripts/flatten-dts.mjs` (and, for the handful of family-grouped components, a `scripts/flatten-family-dts.mjs`) as part of its `build` script to reconcile the two. If you add a new category or family grouping, check whether the existing flatten script already covers the new nesting depth before assuming it does.

## Token system — 3 layers, CSS custom properties

1. **Primitive tokens** (`tokens/primitive.ts`) — raw numeric/OKLCH scales, no meaning attached.
2. **Semantic tokens** (`tokens/semantic.ts`) — intent-based aliases (`color.bg.subtle`, `color.text.muted`). This is the layer light/dark mappings live on.
3. **Component tokens** (`tokens/component.ts`) — per-component overrides for complex multi-variant components (`buttonTokens.primary.bg`). Opt-in — only components with enough variants to need their own token set get one.

Delivered as CSS custom properties in a generated `theme.css` (`pnpm --filter @nebula-lab/react-ui generate-tokens` regenerates it — never hand-edit the file directly). A single `data-theme` attribute on `<html>` (plus a `.dark` class, for Tailwind's default `dark:` strategy) switches every token at once — `ThemeProvider`/`useTheme` handle light/dark/system resolution and persist the choice. Consuming apps override any token via `:root`/`.dark` after importing `theme.css`, no rebuild needed. Check contrast after any color-token change: `pnpm --filter @nebula-lab/react-ui contrast-audit` (see `packages/react-ui/CONTRAST_AUDIT.md` for current pass/fail state).

## Component API conventions (every layer)

- Named export, `forwardRef`, typed via `PrimitivePropsWithRef`/`PolymorphicComponentPropsWithRef` from `@nebula-lab/primitives`.
- Controlled + uncontrolled: `value`/`defaultValue` + `onValueChange`.
- State reflected via `data-state`/`data-disabled`/`data-orientation` attributes, not conditional class toggling.
- Full keyboard support matching its WAI-ARIA APG pattern where interactive, visible `:focus-visible` ring, correct `role`/`aria-*` wiring.

## Testing & Storybook contract (per component)

1. `<name>.tsx` (+ `use-<name>.ts` if logic is non-trivial).
2. `<name>.stories.tsx` — at least a default story, plus a `play` interaction test.
3. `<name>.test.tsx` — Vitest + Testing Library, `vitest-axe` (`toHaveNoViolations()`) where meaningful.
4. A doc comment on every exported symbol with an `@example` block.

Storybook (root `.storybook/`, Vite builder, `addon-a11y`/`addon-essentials`/`addon-interactions`) deployed to GitHub Pages via the manual `Storybook Publish` workflow. Vitest + Testing Library + `vitest-axe` wired at the workspace root (`vitest.config.ts`). React 19 (`^19.0.0` peer dep) across every package — React 18 is not supported.

## Tooling & tech stack

| Concern | Tool |
| --- | --- |
| Monorepo | Nx (task caching, generators, affected-graph) |
| Package manager | pnpm workspaces |
| Build | `tsup`, one entry per component, ESM-only (no CJS — dropped once the workspace standardized on React 19) |
| Styling | Tailwind CSS v4 + CVA + `tailwind-merge` (wrapped as `cn()`) |
| Docs/dev environment | Storybook 8 (Vite builder) |
| Unit/a11y testing | Vitest + React Testing Library + `vitest-axe` |
| Linting | ESLint + layering rules (`eslint.config.mjs`) |
| Versioning/publish | `nx release` → npm, independent per-package versioning under the `@nebula-lab` scope — see `CONTRIBUTING.md`'s "Publishing" section |

## Outstanding work

Carried forward from the now-deleted `COMPONENT_COVERAGE_AUDIT.md` — the one real, active backlog item as of this writing:

**`react-ui-blocks` → `react-ui` molecule moves** — 12 of 14 planned moves remain (`CardListItem`/`PaymentMethodList` already done, proving the pattern: each gains an additive `classNames` slot-map prop so consumers can restyle sub-parts without forking):
`ListingCard`, `ChartCard`, `BalanceCard`, `BillingSummaryCard`, `TeamMemberCard`, `DashboardOverview`, `ThumbnailList`, `RankedList`, `ReviewsList`, `WelcomeBanner`, `PlanCards`, `ProfileHeader`.

Then, once those land:
1. Delete 4 components confirmed page/domain-specific, not molecules: `AuthSplitLayout`, `EntityFormLayout` (both page/view-level shells, not organisms — templates compose their own pages), `TransactionForm` (domain-specific; forms don't belong as shipped molecules at all — `templates/expensiona-desktop`'s own hand-built `TransactionFormDialog` already proves a shared one couldn't cover real needs), `ProductCard` (merge into `ListingCard` — identical shape, give `ListingCard` generic `badge`/`meta`/`rating` slots instead).
2. Repoint every consumer off the old `@nebula-lab/react-ui-blocks` paths (react-ui-blocks' own `compositions/*.stories.tsx`, both `templates/expensiona-*` apps).
3. Update `AGENTS.md`, this doc, `BLOCKS_ARCHITECTURE.md`, both packages' `README.md`.
4. Full verify: build/test/lint/typecheck both packages, Storybook spot-check, both templates typecheck + browser pass.
5. Major-version bump + changelog for both `react-ui` and `react-ui-blocks`.

**10 stay in `react-ui-blocks` as organisms** (composed of, not merged into, `react-ui`): `SaasAppHeader`, `LoginForm`, `SignupForm`, `Hero`, `PromoBanner`/`PromoBannerCarousel`, `ChatWindow`, `NotificationCenter`, `ProductGallery`, `ProductInfoPanel`, `DataTableBlock`.

Add anything else newly identified here, not as a buried note elsewhere, so this section stays the one place to check what's outstanding.

## A note on history

This codebase went through several renames before settling on its current shape: `@nebula-lab/ui` → `@nebula-lab/react-ui`; a `sections`/`layouts` split → merged into `@nebula-lab/react-ui-blocks`; a standalone `@nebula-lab/theme` package → absorbed into `react-ui`; and `headless`/`styleless` swapped names once, then swapped back, before landing on their current, final meanings (`headless` = behavior/ARIA, zero styling; `styleless` = reusable structural API, zero styling, one layer above `headless`). All of that is finished — every mention of these names anywhere in this doc, `AGENTS.md`, or the codebase already reflects the current, final naming. If you find an old commit message, CHANGELOG entry, or comment using an older name, that's a historical record, not a sign anything here is still in flux.
