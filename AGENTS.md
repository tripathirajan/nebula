# AGENTS.md — nebula

Instructions for any AI coding agent (Claude, Codex, Cursor, etc.) working in this repo. Read `ARCHITECTURE.md` for the full rationale and inventory; this file is the condensed, load-bearing rule set — follow it even where the architecture doc is more discursive. Read `DESIGN_REFERENCE.md` before any visual/UX work (new component, restyle, layout) — it's the project owner's standing design charter (Minimals-dashboard-quality benchmark, Nebula's color scheme locked, every other token — spacing/radius/elevation/motion/etc. — open to refine as one cohesive system, never one-off per component).

## What this is

A composable React UI platform: design tokens → headless (unstyled, ARIA-complete) components → hooks → a Tailwind-powered styled design system. Ships as independently-versioned `@nebula-lab/*` packages in a pnpm + Nx monorepo.

## Current state (keep this section accurate as packages land)

Full component inventories now live in each package's own `README.md` (rewritten to be accurate and Storybook-linked) — this table is a quick cross-package orientation, not a duplicate of that detail.

| Package | Status |
| --- | --- |
| `packages/utilities` | Stable. Framework-agnostic helpers, zero workspace deps. See `packages/utilities/README.md`. |
| `packages/hooks` | Stable. React hooks, no dependency on `primitives` or higher. See `packages/hooks/README.md`. |
| `packages/primitives` | Stable. Low-level DOM/layout/composition primitives, zero in-workspace deps. See `packages/primitives/README.md`. |
| `packages/headless` | Stable. ~40 behavior-only, ARIA-complete compound components. See `packages/headless/README.md`. |
| `packages/styleless` | Stable, coverage-complete. ~18 components extracted (`button`, `icon-button`, `split-button`, `fab`, `input`, `search-input`, `password-input`, `email-input`/`tel-input`/`url-input`, `textarea`, `avatar`/`avatar-group`, `image-preview`, `data-table`, `data-grid`, `code-block`, `password-strength-indicator`), each wired into a `react-ui` consumer. Everything else in the original extraction plan was investigated and explicitly resolved as either a duplicate or having no real behavior left to decouple from `headless`/`react-ui`; a handful (`CloseButton`, `MaskInput`, `CurrencyInput`, `NavigationRail`, `LocaleSwitcher`) remain deferred pending a real consumer. See `packages/styleless/README.md`. |
| `packages/react-ui` | Stable, actively growing. ~100 styled components across Layout/Typography/Forms/Overlays/Navigation/Data Display/Feedback/Media/Drag & Drop/Theming. Absorbed the former `packages/theme` package (tokens/theming only ever had this one real consumer). See `packages/react-ui/README.md`. |
| `packages/react-ui-blocks` | Stable, actively growing. Composed blocks organized by vertical (authentication/dashboard/ecommerce/marketing/navigation/social/communication/data-display/forms/layouts) plus full-page compositions. See `packages/react-ui-blocks/README.md`. |
| `templates/expensiona-desktop`, `templates/expensiona-mobile` | Example CSR apps (private, unpublished workspace packages, not part of the `@nebula-lab/*` release pipeline) — themed as `expensiona` (see `[[project-expensiona]]` memory), an expense-tracker/budget-planner, desktop admin+reporting split from a restricted-scope mobile app. Real consumers of `react-ui`/`react-ui-blocks` via the pnpm-workspace `workspace:*` protocol, not Storybook stories, mock data only. Each has its own `README.md` with run instructions and the Tailwind `@source` gotcha every out-of-repo consumer will also hit. |

**Tooling:** Storybook (root `.storybook/`, Vite builder, `addon-a11y`/`addon-essentials`/`addon-interactions`, every component has at least one story with a `play` interaction test) deployed to GitHub Pages at https://tripathirajan.github.io/nebula/ via the manual `Storybook Publish` workflow. Vitest + Testing Library + `vitest-axe` wired at the workspace root. React 19 (`^19.0.0` peer dep) across every package — React 18 is not supported.

**Publishing:** Wired and live — packages publish to npm under the `@nebula-lab` scope (renamed from `@nebula` after discovering that scope was owned by an inaccessible personal account) via the manual `Publish Package` GitHub Actions workflow (`nx release version` + build + `nx release publish`, independent per-package versioning). See `CONTRIBUTING.md`'s "Publishing" section.

**Pending / not yet built:**
- The `react-ui-blocks` → `react-ui` molecule moves tracked in `ARCHITECTURE.md`'s "Outstanding work" section — the only confirmed outstanding backlog item as of this writing.
- Anything else newly identified — add it here, not as a buried note elsewhere, so this list stays the single place to check what's outstanding.

Before claiming a component "already exists," check the actual `packages/*/src` tree — don't trust this table blindly if it looks stale, and update it in the same PR that adds a package.

## Non-negotiable architecture rules

1. **Layer dependency direction is one-way:** `utilities` → `hooks` → `primitives` → `headless` → `styleless` → `react-ui` → `react-ui-blocks`. `styleless` is stable and coverage-complete (see the status table above); `react-ui` continues building directly on `headless`/`primitives` for components with no `styleless` shell (most components — `styleless` only exists where an unstyled, reusable structural API is genuinely worth having independent of its `react-ui` styling). A lower layer must never import from a higher one. `eslint.config.mjs` enforces this per-package via `no-restricted-imports`; add a new block there for each new package rather than disabling the rule.
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
pnpm --filter @nebula-lab/primitives <script>   # scope any script to one package
```

## Layer placement: hooks vs primitives vs headless vs styleless vs react-ui

**Terminology note:** `@nebula-lab/headless` is the layer that solves *behavior*: full ARIA/keyboard/focus/positioning, zero CSS opinion. `@nebula-lab/styleless` is a **different layer** sitting between `headless` and `react-ui` — a reusable UI component that composes `primitives`/`headless` into a complete, semantic API with *still* no visual opinion (e.g. an unstyled-but-structurally-real `Button`/`Input`/`Card`/`Table`). Don't conflate the two: `headless` answers "how does this behave," `styleless` answers "what's the reusable shape," `react-ui` answers "what does Nebula's design system make it look like." (This distinction went through a naming churn early in the project's history — `headless`/`styleless` briefly swapped meanings before settling — see `ARCHITECTURE.md`'s "A note on history" if you ever encounter an old commit/comment using the older names.)

Project-owner-confirmed decision guide — ask these in order for any new (or reclassified) component:

```
1. Is it a low-level DOM abstraction?
   └─ Yes → Primitive

2. Does it primarily solve reusable interaction, state management,
   accessibility, keyboard navigation, focus management, or positioning?
   └─ Yes → Headless

3. Is it a reusable UI component that composes primitives and/or headless
   components without providing opinionated styling?
   └─ Yes → Styleless

4. Does it add the Nebula design system (Tailwind styles, variants, themes,
   animations, sizes, colors)?
   └─ Yes → React UI
```

Rules of thumb: **Primitive** = "abstracts HTML." **Headless** = "solves behavior." **Styleless** = "provides a reusable UI API." **React UI** = "provides Nebula's visual design." (`react-ui-blocks` sits above all four: it assembles multiple `react-ui` components into a full screen/module, e.g. `LoginForm`, `DashboardLayout`.)

Expanded per-question tests, with this codebase's own examples:

1. **Zero DOM/JSX of its own — just state + event wiring a consumer attaches to *any* markup shape?** → `@nebula-lab/hooks`, not even a primitive. Test: "if every component in this repo were deleted, would this still make sense as a standalone utility a consumer calls and gets back plain values/callbacks?" Examples: `useControllableState`, `useFocusTrap`, `useDebounce`, `useVirtualizer`.
2. **Renders DOM, but is either (a) cross-cutting plumbing reused across many unrelated widgets, or (b) a single atomic element with no named WAI-ARIA widget pattern of its own?** → `@nebula-lab/primitives`. Examples: `Slot`/`Portal`/`Presence`/`RovingFocusGroup`/`Popper`/`DismissibleLayer`/`VisuallyHidden`/`FocusScope` (shared infrastructure) and `Box`/`Text`/`Heading`/`Image`/`Button`/`Input`/`Textarea`/`Label`/`VStack`/`HStack`/`Wrap`/`Spacer` (atomic elements, no compound sub-parts, no keyboard pattern beyond the native tag).
3. **Implements a specific named WAI-ARIA authoring-practice pattern, usually via multiple coordinated sub-components (`Root`/`Trigger`/`Content`/`Item`) sharing context?** → `@nebula-lab/headless`. Examples: `Accordion`, `Dialog`, `Popover`, `Menu`, `Select`, `Combobox`, `Tabs`, `Tree`, `Listbox`.
4. **A reusable, complete UI component built on `primitives`/`headless` but still carrying zero Tailwind/visual opinion?** → `@nebula-lab/styleless` — see the `Current state` table; stable and coverage-complete (~18 components extracted, a handful of new/deferred candidates listed there). This is *not* the same test as step 3: `Button`/`Input`/`Card`/`Table` have a real, complete structural API worth reusing unstyled, but none of them is itself a named ARIA *widget* pattern the way `Dialog`/`Combobox` are — they either have no interactive state machine at all (`Card`), or their state machine already lives one layer down in `headless` (a styleless `Select` shell wraps `headless`'s `Select`/`Listbox` behavior, it doesn't reimplement it).
5. **Purely presentational structure with no interactive/keyboard behavior at all** (a page-layout region, a stat block)? → skip `headless` (nothing to decouple), but still consider `styleless` first if the shape is reusable across projects (`Card`, `Header`/`Footer`/`Sidebar`, `List`) before defaulting straight to `react-ui`.
6. **Judgment call: a genuinely new widget whose "behavior" is really just state + native semantics** (native `<table>` sort/select, native HTML5 drag-and-drop, CSS-transform slide logic) **rather than a bespoke ARIA pattern.** Built directly in `react-ui` today, explicitly as a documented project-owner decision each time, not a default — `Carousel`, `DataTable`, `DataGrid`, `Draggable`/`Droppable`/`Sortable`, `MultiSelect`, `Calendar`/`DatePicker`/`DateRangePicker`. Write the same kind of one-paragraph justification if you hit a new case like this — don't silently default anywhere just because something similar landed in `react-ui` before.

Applying this test resolves every future placement question — five real buckets (hooks / primitives / headless / styleless / react-ui) cover the space; check `COMPONENT_INVENTORY.md` and `COMPONENT_FAMILIES.md` (see `ARCHITECTURE.md`) before re-deriving a placement from scratch — a plausible-sounding new component is very often already a named variant of something that exists.

## Adding a new component, hook, or utility

Use the matching skill to scaffold the correct boilerplate rather than hand-copying an existing unit and forgetting to update its barrel/exports map:

- `new-component` (`.claude/skills/new-component/SKILL.md`) — the folder structure above, for `primitives`/`headless`/`styleless`/`react-ui`/`react-ui-blocks`.
- `new-hook` (`.claude/skills/new-hook/SKILL.md`) — `packages/hooks` (zero DOM, no in-workspace deps).
- `new-utility` (`.claude/skills/new-utility/SKILL.md`) — `packages/utilities` (framework-agnostic, no in-workspace deps).

Publishing a release? Use the `release-checklist` skill (`.claude/skills/release-checklist/SKILL.md`) rather than dispatching the `Publish Package` workflow from memory — it encodes real gotchas this repo has actually hit (a stale `latest` dist-tag, `nx release version` pinning internal deps and breaking the next CI install), not just the happy path.

## When in doubt

Prefer matching an existing pattern in `packages/primitives` over inventing a new one. If the architecture doc and the actual code disagree, the code plus this file win — flag the discrepancy rather than silently resolving it either way.
