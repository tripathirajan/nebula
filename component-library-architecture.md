# `nebula` — Architecture & Component Inventory

**Headless-primitive, Tailwind v4-styled, WAI-ARIA-compliant React component system**
_Prepared for: Budget Tracker (React + Firebase) — reusable as a standalone OSS package_

> **Reference alignment:** This revision is aligned to the existing reference repo [`tripathirajan/nebula`](https://github.com/tripathirajan/nebula), which already implements Layers 0–2 below (`utilities`, `hooks`, `primitives`, `headless`, `theme`, `ui`). We are **extending** it with the two missing layers — `sections` and `layouts` — plus the additional primitives/headless components the budget tracker needs (DataTable, Combobox, DatePicker, Chart adapter). Package names below use the repo's real `@nebula/*` scope and its 3-layer token system rather than the earlier placeholder naming.

> **Naming update (post-implementation):** `@nebula/ui` was renamed to **`@nebula/react-ui`**, and `sections` + `layouts` were merged into a single **`@nebula/react-ui-blocks`** package — both had the identical dependency shape (built purely on `react-ui` + `theme`, nothing above them) so keeping them split was a package boundary without a real architectural distinction. `react-ui-blocks` is deliberately domain-neutral, not ecommerce- or budget-tracker-specific — this doc's `sections`/`layouts` inventory (§5/§6) still describes real, wanted components, just landing in one merged package now. `@nebula/theme` was subsequently **absorbed into `@nebula/react-ui`** — nothing else in the workspace (`primitives`/`headless` are deliberately unstyled) ever consumed tokens/theming, so the split was a package boundary with exactly one real consumer; `react-ui` now owns `Button` + the 3-layer token system + `ThemeProvider`/`useTheme` together. `@nebula/headless` was then renamed to **`@nebula/styleless`**, and — per a subsequent architecture pass — renamed back to **`@nebula/headless`**, this time for real: the project owner confirmed a 5-tier model (`primitives → headless → styleless → react-ui → react-ui-blocks`) where `headless` (behavior/ARIA, zero styling) and `styleless` (unstyled but structurally complete `Button`/`Input`/`Card`/etc.) are two genuinely distinct layers, not one renamed package. `styleless` in that final sense is a **new, not-yet-built** package — see `LAYER_TAXONOMY.md` for the full extraction plan and `AGENTS.md`'s "Layer placement" section for the current 5-way test. Everywhere below that says `ui`, `sections`, `layouts`, `theme`, or `headless`, read `react-ui` / `react-ui-blocks` / `react-ui-blocks` / `react-ui` / `headless` respectively (not `styleless` — that name now means the different, new middle layer). See `AGENTS.md`'s status table for what's actually built.

---

## 0. Reality Check & Strategy (read this first)

You have **1 week** for the whole product. A full MUI-scale library (primitives + styled + composite + layouts + Storybook + tests + npm publish) is normally a multi-month effort for a team. To hit your deadline **and** end up with a genuinely reusable package:

| Phase                               | Scope                                                                                                 | Timeline                |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------- |
| **Phase 0 — Foundation**            | `Slot`, `Primitive`, `cn()`, tokens, 10–12 core primitives + styled wrappers                          | Day 1–2                 |
| **Phase 1 — MVP (ship the app)**    | Auth forms, Dashboard layout, Transaction table/form, Modal, Toast, Chart wrapper                     | Day 2–5                 |
| **Phase 2 — Polish**                | Storybook stories for what you built, a11y + unit tests, theme (dark mode)                            | Day 6                   |
| **Phase 3 — Publish**               | Changesets, README, npm publish `v0.1.0`                                                              | Day 7                   |
| **Phase 4 — Post-launch (backlog)** | Remaining primitives (Table, Combobox, DatePicker, Command, etc.), full layout set, visual regression | Ongoing, after delivery |

**Rule of thumb:** build the primitive + styled version of a component **only when the app needs it**. Everything in section 3–6 below is the full target inventory (so the package _becomes_ MUI-scale over time) — but your Week-1 build order should follow the Phase table, not the full list top-to-bottom.

---

## 1. Core Philosophy

1. **Unstyled primitives own behavior + accessibility.** Styled components own visuals. Composite sections own product logic. Layouts own page structure.
2. **Everything is built on `Slot` + `Primitive`.** No component hardcodes its rendered DOM tag — consumers can always override via `asChild`.
3. **Uncontrolled by default, controllable when needed** (value/onValueChange pairs), matching native HTML semantics.
4. **Every interactive primitive follows the WAI-ARIA Authoring Practices Guide (APG)** for its pattern (roles, keyboard interaction, focus management).
5. **Style via Tailwind v4 tokens + CVA**, never inline hardcoded colors — theme-ability is non-negotiable for an OSS package.
6. **Every component ships with**: TS types, Storybook story (+ `play` interaction test), unit test, a11y test (axe), and a doc block.

---

## 2. Layered Architecture (matches `nebula` package boundaries)

```
@nebula/utilities   Framework-agnostic helpers: mergeRefs, composeEventHandlers,
                         createContext, clamp, debounce, throttle, deepMerge,
                         isHTMLElement, isFocusable
                         │
@nebula/hooks       React hooks: useControllableState, useClickOutside,
                         useMediaQuery, useScrollLock, useFocusTrap,
                         useResizeObserver, useIntersectionObserver,
                         useLocalStorage, useDebounce, useId, useBoolean,
                         useToggle, useStableCallback, useEventListener,
                         usePrevious, useMounted
                         │
@nebula/primitives   Slot, Primitive, Portal, Presence, Boundary,
                         FocusScope, DismissibleLayer, Overlay, VisuallyHidden
                         + unstyled layout/text primitives: Box, Container, Flex,
                         Grid, Stack, Inline, Center, AspectRatio, Text, Heading,
                         Paragraph, Code, Pre, Link
                         + unstyled form primitives: Button, Input, Textarea,
                         Label, Form
                         │
@nebula/headless     Behavior-only, ARIA-complete: Tabs/TabList/Tab/TabPanel,
                         Accordion/AccordionItem/Header/Panel, Dialog + subparts,
                         Switch, Checkbox, RadioGroup/RadioGroupItem,
                         Collapsible + subparts, Toggle/ToggleGroup/Item,
                         Tooltip + subparts, Popover + subparts
                         │
@nebula/react-ui           Tailwind-powered styled versions of the above, built on
                         theme tokens: Button, Input/Textarea, Card + subparts,
                         Badge, Separator, Avatar + subparts, Switch, Checkbox,
                         Tabs, Accordion, Dialog, cn() (clsx + tailwind-merge)
                         │
@nebula/sections     ← NEW (this project) — composite product blocks
                         (LoginForm, ChangePasswordForm, TransactionForm,
                         DataTable, ChartCard, BudgetProgressCard, FilterBar...)
                         │
@nebula/layouts      ← NEW (this project) — page-level shells
                         (AppLayout, DashboardLayout, AuthLayout, SettingsLayout)

Cross-cutting:
@nebula/theme        3-layer tokens (primitive → semantic → component),
                         delivered as CSS custom properties, ThemeProvider/useTheme,
                         single `data-theme` attribute switch (no hydration flicker)
```

**Why this ordering matters for dependency direction:** `utilities` and `hooks` depend on nothing else in the workspace; `primitives` depends only on `utilities`; `headless` depends on `primitives` + `hooks`; `ui` depends on `headless` + `theme`; `sections` depends on `ui` + `theme`; `layouts` depends on `sections` + `ui`. Nx's project graph will enforce this via `implicitDependencies`/module boundaries so a lower layer can never import from a higher one.

---

## 3. Layer 0 — Core (build once, reuse everywhere)

| Module                 | Purpose                                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Primitive`            | Polymorphic base — every DOM element (`Primitive.div`, `Primitive.button`, ...) rendered through one factory so behavior (event composition, ref forwarding) is consistent. |
| `Slot`                 | Merges props/ref/children onto a single child element — powers `asChild` on every component.                                                                                |
| `Slottable`            | Marks which child in a composite should receive slotted props when multiple children exist.                                                                                 |
| `composeRefs`          | Merge multiple refs safely.                                                                                                                                                 |
| `composeEventHandlers` | Merge user handler + internal handler, respecting `preventDefault`.                                                                                                         |
| `createContextScope`   | Scoped context factory so nested instances of the same component (e.g. nested Tabs) don't collide.                                                                          |
| `useControllableState` | Single hook for controlled/uncontrolled value pattern used by Checkbox, Select, Tabs, Switch, etc.                                                                          |
| `Portal`               | Renders into `document.body` (or custom container) — backbone for Dialog/Popover/Toast/Tooltip.                                                                             |
| `FocusScope`           | Trap/restore focus for modals, dialogs, menus.                                                                                                                              |
| `DismissibleLayer`     | Escape-key / outside-click / layered dismissal stack (so nested popovers close correctly).                                                                                  |
| `usePresence`          | Enables exit animations before unmount (for Dialog/Toast/Accordion content).                                                                                                |
| `VisuallyHidden`       | Screen-reader-only content.                                                                                                                                                 |

---

## 4. Layer 1 & 2 — Primitive Inventory (Unstyled → Styled)

Grouped by category. **Bold** = needed for Week-1 MVP.

### 4.1 Inputs & Forms

| Component                        | ARIA Pattern                       | Notes                                                |
| -------------------------------- | ---------------------------------- | ---------------------------------------------------- |
| **Button**                       | `button`                           | loading/disabled states, `asChild` for link-buttons  |
| **Input** (text/number/password) | native                             | forwardRef, error state via `aria-invalid`           |
| **Textarea**                     | native                             | auto-resize variant                                  |
| Currency/Number Input            | native + formatting                | mask via Intl.NumberFormat — budget-tracker specific |
| **Checkbox**                     | WAI-ARIA Checkbox                  | tri-state support                                    |
| **RadioGroup**                   | WAI-ARIA Radio Group               | roving tabindex                                      |
| **Switch**                       | WAI-ARIA Switch                    |                                                      |
| **Select** (native-like)         | WAI-ARIA Listbox                   | typeahead, keyboard nav                              |
| Combobox / Autocomplete          | WAI-ARIA Combobox                  | for category/tag pickers                             |
| DatePicker / DateRangePicker     | WAI-ARIA Dialog + Grid             | for filtering transactions by date                   |
| Slider                           | WAI-ARIA Slider                    | budget range filters                                 |
| **Label**                        | native `label`                     | auto-links via `htmlFor`/`id`                        |
| **Form** (wrapper)               | native + `aria-describedby` wiring | integrates with react-hook-form / zod                |
| FieldError / HelperText          | `role="alert"` region              |                                                      |
| ToggleGroup                      | WAI-ARIA Toolbar/Radiogroup        | view switchers (list/grid)                           |
| FileUpload / Dropzone            | custom, `aria-live` status         | receipts upload                                      |
| Rating                           | WAI-ARIA Slider variant            | optional                                             |
| Tag/Chip Input                   | WAI-ARIA Listbox + Grid            | multi-category tagging                               |

### 4.2 Overlays

| Component                | ARIA Pattern                        | Notes                                  |
| ------------------------ | ----------------------------------- | -------------------------------------- |
| **Dialog / Modal**       | WAI-ARIA Dialog (Modal)             | Portal + FocusScope + DismissibleLayer |
| AlertDialog              | WAI-ARIA Alertdialog                | confirm-delete, destructive actions    |
| **Drawer / Sheet**       | WAI-ARIA Dialog (non-modal variant) | mobile nav, filters panel              |
| Popover                  | WAI-ARIA Dialog (non-modal)         | anchored positioning                   |
| **Tooltip**              | WAI-ARIA Tooltip                    | hover/focus, delay group               |
| DropdownMenu             | WAI-ARIA Menu                       | roving tabindex, submenus              |
| ContextMenu              | WAI-ARIA Menu                       | right-click actions on rows            |
| HoverCard                | custom (non-ARIA-critical)          | preview cards                          |
| CommandPalette           | WAI-ARIA Combobox/Listbox           | ⌘K quick actions                       |
| **Toast / Notification** | WAI-ARIA `status`/`alert` region    | queue + auto-dismiss                   |

### 4.3 Navigation

| Component        | ARIA Pattern             | Notes                        |
| ---------------- | ------------------------ | ---------------------------- |
| **Tabs**         | WAI-ARIA Tabs            | dashboard sub-views          |
| Accordion        | WAI-ARIA Accordion       | FAQ / settings groups        |
| Breadcrumb       | `nav` + `aria-label`     |                              |
| Pagination       | `nav` + `aria-current`   | transaction list paging      |
| NavigationMenu   | WAI-ARIA Menubar         | top-level app nav            |
| Stepper / Wizard | WAI-ARIA Tablist variant | onboarding, multi-step forms |
| Menubar          | WAI-ARIA Menubar         |                              |

### 4.4 Data Display

| Component             | ARIA Pattern                   | Notes                                |
| --------------------- | ------------------------------ | ------------------------------------ |
| **Table / DataTable** | native `table` + `aria-sort`   | sortable, paginated transaction list |
| Avatar                | native `img` + fallback        |                                      |
| **Badge**             | native                         | category/status pill                 |
| **Card**              | native `section`               | KPI/stat cards                       |
| **Alert / Banner**    | `role="alert"`/`role="status"` |                                      |
| Progress              | WAI-ARIA Progressbar           | **budget usage bar**                 |
| **Skeleton**          | `aria-busy`                    | loading placeholders                 |
| **Spinner**           | `role="status"`                |                                      |
| Separator             | WAI-ARIA Separator             |                                      |
| ScrollArea            | native + custom scrollbar      |                                      |
| AspectRatio           | layout-only                    | chart containers                     |
| EmptyState            | `role="status"`                | "No transactions yet"                |
| StatCard / KPIWidget  | composite of Card              | income/expense/balance widgets       |

### 4.5 Feedback / Async

| Component                 | Notes                            |
| ------------------------- | -------------------------------- |
| ErrorBoundary UI          | fallback component, retry action |
| Loading/Suspense fallback | skeleton-based                   |
| ConfirmDialog             | thin wrapper over AlertDialog    |

---

## 5. Layer 3 — Composite Sections (product-flavored, still generic/reusable)

These compose Layer 1/2 primitives into ready-made blocks — the "MUI templates" layer.

**Auth**

- `LoginForm`, `SignupForm`, `ForgotPasswordForm`, `ChangePasswordForm`, `VerifyEmailNotice`, `SocialAuthButtons` (Google/Firebase)

**Account / Settings**

- `ProfileForm`, `AccountSettingsPanel`, `ThemeSwitcher`, `DangerZone` (delete account, confirm via AlertDialog)

**Budget-domain (still generic/parameterizable so it's reusable beyond this project)**

- `TransactionForm` (amount, category, date, note)
- `TransactionList` / `TransactionTable` (built on DataTable)
- `CategoryPicker` (built on Combobox)
- `BudgetProgressCard` (built on Progress + Card)
- `ChartCard` — wraps a charting lib (Recharts/Visx) behind a themed `LineChart`, `BarChart`, `DonutChart`, `AreaChart` primitive-adapter so the OSS package doesn't hard-lock a chart library
- `SummaryStatsRow` (Income/Expense/Balance StatCards)
- `FilterBar` (DateRangePicker + CategoryPicker + Select combo)

**Cross-cutting UI patterns**

- `ModalWithPortal` reference pattern (Dialog + Portal + FocusScope composition example)
- `ConfirmActionDialog`
- `NotificationCenter` (Toast queue provider)
- `SearchCommandBar`
- `DataTableToolbar` (search + filters + export)

---

## 6. Layer 4 — Layouts

| Layout                                     | Breakpoint behavior                                                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **AppLayout**                              | Root shell: theme provider, toast provider, portal root, global font/token setup                                                   |
| **DashboardLayout**                        | Sidebar (collapsible) + Topbar + content region; sidebar → bottom nav or drawer on mobile                                          |
| **AuthLayout**                             | Centered card, split-screen illustration on desktop, full-bleed on mobile                                                          |
| **SettingsLayout**                         | Side nav (desktop) → tabs (mobile)                                                                                                 |
| Responsive grid primitives                 | `Container`, `Stack`, `Grid`, `Flex` — thin Tailwind-token-driven layout primitives so consumers don't write raw flex/grid classes |
| Mobile / Tablet / Desktop breakpoint hooks | `useBreakpoint()`, `<Show above="md">` helper components                                                                           |

---

## 7. Theming — 3-layer token system (as implemented in `@nebula/theme`)

1. **Primitive tokens** — raw numeric scales, no meaning attached: `blue.500`, `gray.200`, `spacing.4`, `radius.md`. Numeric scale, not t-shirt sizes (`blue.500`, not `blue.medium`) — easier to insert intermediate values later.
2. **Semantic tokens** — intent-based aliases following `category.role.variant`: `color.bg.subtle`, `color.text.muted`, `color.border.interactive`. Readable without knowing the underlying primitive; this is the layer light/dark mappings live on.
3. **Component tokens** — per-component overrides for complex multi-variant components: `buttonTokens.primary.bg`, `inputTokens.border`. Opt-in — only components with enough variants to need it get their own token set.

**Delivery:** tokens compile to CSS custom properties in a generated `theme.css`:

```css
:root {
  --color-bg-default: #ffffff;
  --color-text-default: #111827;
  --color-border-default: #e5e7eb;
}
[data-theme="dark"] {
  --color-bg-default: #030712;
  --color-text-default: #f9fafb;
  --color-border-default: #1f2937;
}
```

A single `data-theme` attribute on `<html>` switches every token at once — no hydration flicker, no class explosion. `ThemeProvider`/`useTheme` handle light/dark/system resolution and persist the choice; the colors themselves resolve via CSS, not JS re-render.

**Regenerating tokens:** edit `packages/theme/src/tokens/primitive.ts` (scales) or `semantic.ts` (light/dark mappings), then run `npx tsx packages/theme/src/tokens/generate.ts` to rebuild `theme.css`.

- `cva` (class-variance-analysis) + `tailwind-merge` (wrapped as `cn()`) power every styled component's variant API (`variant`, `size`, `intent`, `tone`) in `@nebula/react-ui`.

---

## 8. Tooling & Tech Stack

| Concern                     | Tool                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo                    | **Nx** (recommend over Lerna for this — better task caching, generators, and affected-graph for a component-library-scale repo) |
| Package manager             | pnpm (workspaces)                                                                                                               |
| Build                       | `tsup` (fast, ESM-only + `.d.ts`) per package — CJS output was dropped once the workspace standardized on React 19; every `@nebula/*` package ships `type: "module"` with no `require` export condition |
| Styling                     | Tailwind CSS v4 + CVA + `tailwind-merge`                                                                                        |
| Primitives base             | Hand-rolled `Slot`/`Primitive` (Radix's MIT-licensed source is a legitimate reference implementation to study/adapt)            |
| Docs/dev environment        | Storybook 8 (Vite builder) + `@storybook/addon-a11y` + `@storybook/test` (play functions)                                       |
| Unit/a11y testing           | Vitest + React Testing Library + `vitest-axe` (or `jest-axe` equivalent)                                                        |
| Visual regression (Phase 4) | Chromatic or Playwright screenshot tests                                                                                        |
| Versioning/publish          | Changesets → npm (scoped `@yourscope/ui`)                                                                                       |
| Linting                     | ESLint + `eslint-plugin-jsx-a11y` (catch ARIA mistakes at author-time)                                                          |

---

## 9. Monorepo Layout (as it exists in `nebula`, plus our additions)

```
.storybook/                 # Storybook config (already present) — also owns Tailwind's
                             # entry CSS + Vite plugin now (apps/playground removed, see below)
apps/
  budget-tracker/             # ← NEW: the actual client app (React + Firebase)
docs/                        # (already present)
packages/
  utilities/                  # ✅ exists
  hooks/                      # ✅ exists
  primitives/                 # ✅ exists
  headless/                   # ✅ exists
  theme/                      # ✅ exists
  ui/                         # ✅ exists
  sections/                   # ← NEW: composite product blocks (Layer 3)
  layouts/                    # ← NEW: page-level shells (Layer 4)
scripts/                     # (already present — token generation, etc.)
nx.json                      # ✅ exists — Nx already wired in
pnpm-workspace.yaml           # ✅ exists — pnpm workspaces, not npm/yarn
tsup.config.ts                # ✅ exists — shared build config
vitest.config.ts / .setup.ts  # ✅ exists — testing already wired
```

Each `packages/*` is independently versioned/published (Changesets recommended — not yet in the repo, worth adding). `budget-tracker` (once it exists) consumes workspace packages directly during development (`workspace:*` protocol via pnpm) and published versions post-release. There is no `apps/playground` anymore — it was a smoke-test harness that duplicated per-component Storybook coverage and was removed; use Storybook for isolated component review during development instead.

**Package scope:** the repo uses `@nebula/*` (e.g. `@nebula/react-ui`, `@nebula/headless`). Keep this scope consistent for `sections` and `layouts` too: `@nebula/sections`, `@nebula/layouts`.

---

## 9.1 Export / Code-Splitting Convention (matches existing `headless`/`ui` pattern)

The reference repo already follows this — **make it explicit and non-negotiable** for the new `sections`/`layouts` packages too:

- **One component (and its subparts) per folder, never a god-file.** e.g. `Dialog` in `headless` is `Dialog`, `DialogTrigger`, `DialogContent`, `DialogOverlay`, `DialogTitle`, `DialogDescription` — each a separate module, composed via a shared context, re-exported together.

```
packages/sections/src/
  login-form/
    login-form.tsx
    login-form.types.ts
    use-login-form.ts        # form logic hook, kept out of the component file
    index.ts                  # re-export only
  transaction-form/
    transaction-form.tsx
    transaction-form.types.ts
    category-field.tsx        # sub-part gets its own file, not inlined
    amount-field.tsx
    index.ts
  chart-card/
    chart-card.tsx
    chart-card.types.ts
    adapters/
      line-chart-adapter.tsx  # swappable chart-lib adapter, isolated
      bar-chart-adapter.tsx
    index.ts
  index.ts                     # package barrel: export * from './login-form'; ...
```

- Package `index.ts` files are **barrels only** — zero logic, just re-exports. Bundlers can tree-shake per-component when consumers import from the subpath.
- `package.json` for each new package sets `"sideEffects": false` and defines an `exports` map with per-component subpaths (e.g. `@nebula/sections/login-form`), same convention `ui`/`headless` already use — confirm by checking their existing `package.json` `exports` field before scaffolding `sections`/`layouts` so the convention matches exactly.
- `tsup.config.ts` (already shared at the repo root) should get multiple entry points added for the new packages — one per component/category — not a single bundled entry, exactly as the existing packages are built.

---

## 10. Component API Conventions (apply to every component)

- Every component supports `asChild` where DOM-tag flexibility makes sense.
- Controlled + uncontrolled: `value`/`defaultValue` + `onValueChange`.
- State reflected via `data-state`, `data-disabled`, `data-orientation` attributes (stylable, testable, no JS class toggling needed).
- All refs forwarded (`forwardRef`), all props typed as `ComponentPropsWithoutRef<'tag'> & OwnProps`.
- Every interactive component: full keyboard support matching its APG pattern, visible focus ring (`:focus-visible`), correct `role`/`aria-*` wiring, and screen-reader-announced state changes where relevant (`aria-live`, `role="status"`).

---

## 11. Testing & Storybook Contract (per component)

Each component ships with:

1. `Component.tsx` + `Component.types.ts`
2. `Component.stories.tsx` — states (default, disabled, error, loading) + a `play` interaction test
3. `Component.test.tsx` — behavior (Testing Library)
4. `Component.a11y.test.tsx` — automated axe scan, zero violations gate
5. MDX or story `docs` page — usage + props table (auto-generated from TS types via `react-docgen-typescript`)

---

## 12. Week-1 Build Order (updated: most of Layer 0–2 already exists in `nebula`)

0. **Audit first (Day 0, ~2 hrs):** clone `nebula`, run `pnpm install && pnpm storybook`, and inventory exactly which of the components in section 4 already exist vs. still need building. Don't rebuild `Button`/`Tabs` — they're already implemented in `@nebula/primitives`/`headless`/`ui`; `Dialog`/`Accordion`/`Checkbox`/`Switch`/`Card`/`Badge`/`Avatar`/`Separator` are still open (see AGENTS.md's status table for the current, accurate list — this section predates several of them actually landing).
1. **Fill primitive/headless/ui gaps** needed for the budget tracker that aren't in the repo yet: `Select`/`Combobox`, `Toast`, `Table`, `Progress`, `Skeleton`, `Spinner`, `DateRangePicker`. Follow the exact same file-per-component + barrel pattern already used for `Dialog`/`Tabs`.
2. **New package `@nebula/layouts`**: `AppLayout`, `AuthLayout`, `DashboardLayout` — built on existing `Box`/`Flex`/`Grid`/`Stack` primitives, themed via existing `@nebula/theme`.
3. **New package `@nebula/sections`**: `LoginForm`, `SignupForm`, `ChangePasswordForm`, `TransactionForm`, `TransactionTable` (on the new `Table` primitive), `ChartCard` (adapter over Recharts/Visx — decide below), `BudgetProgressCard` (on existing `Progress` once built), `SummaryStatsRow`, `FilterBar`.
4. Wire `apps/budget-tracker` (a new, standalone app — there's no more `apps/playground` to sit alongside) into Firebase Auth/Firestore, consuming `@nebula/sections` + `@nebula/layouts`.
5. Storybook stories + tests for every new component (in parallel with steps 1–3, not after) — reuse the repo's existing `.storybook` config and CI-gated Pages deploy workflow.
6. Add Changesets (not yet in the repo) + version bump + `npm publish --access public` for the two new packages (and any updated existing ones).

---

## 13. Open Decisions (need your input before scaffolding)

- Chart library: Recharts (simplest, good a11y) vs Visx (more control, more work)?
- Form library: react-hook-form + zod (recommended) — confirm?
- Icon set: repo doesn't have one yet — lucide-react wrapped through a `Primitive`-based icon component, or fully custom SVGs?
- Confirm you have write access to `tripathirajan/nebula` (or it's your own repo/alias) so we're extending it directly rather than forking — changes the setup step (`git clone` + branch vs. fork).
- Should `sections`/`layouts` also get Changesets added now, or defer versioning until after the app ships?
