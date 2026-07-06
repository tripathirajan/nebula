# nebula — Status & Compliance Report

_Generated 2026-07-05. Covers everything requested in the build conversation to date, cross-checked against the actual `packages/*/src` tree, plus a standards/legal compliance read on the accessibility work._

---

## Part 1 — Build checklist

### Requested and fully covered

| # | Ask | Where it lives | Notes |
| --- | --- | --- | --- |
| 1 | Monorepo setup: pnpm workspaces, Nx, TypeScript strict, ESLint 9 flat config, Prettier | root `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`, `eslint.config.mjs`, `.prettierrc.json` | Layered `no-restricted-imports` rules enforce the dependency graph. |
| 2 | `@nebula/primitives` core (`Slot`, `Primitive`, `cn`, ref/event composition, scoped context) | `packages/primitives/src` | Originally a hardcoded `Primitive.tag` factory; reworked (see #8). |
| 3 | Storybook 8 (Vite builder) | root `.storybook/`, `packages/*/src/**/*.stories.tsx` | `addon-a11y` + `addon-essentials` + `addon-interactions`; every shipped component has ≥1 story with a `play` interaction test. |
| 4 | `AGENTS.md` / `CLAUDE.md` + a scaffolding skill | root `AGENTS.md`, `CLAUDE.md`, `.claude/skills/new-component/SKILL.md` | Status table kept current through this session. |
| 5 | `@nebula/utilities`, `@nebula/hooks` packages | `packages/utilities`, `packages/hooks` | 6 utilities, 16 hooks; zero in-workspace dependencies (bottom of the graph, by design). |
| 6 | `@nebula/theme` (design tokens + provider) | `packages/theme/src/tokens/{primitive,semantic,component}.ts`, `theme-provider.tsx` | 3-layer token system compiled to `theme.css`; light/dark/system, persisted, no hydration flash only if you add the documented inline SSR script. |
| 7 | `@nebula/headless`, `@nebula/react-ui`, `@nebula/sections`, `@nebula/layouts` seeded | `Tabs`, `Button`, `ThemeSwitcher`, `AppLayout` respectively | One real, fully-built component per layer — see "Partially covered" below for what's still missing in each. |
| 8 | Rework `Primitive` into a true polymorphic component (`as` + `asChild`, not a hardcoded tag list) | `packages/primitives/src/primitive/primitive.tsx`, `src/types/polymorphic.ts` | Matches the `forwardRef` + generic-cast pattern you specified; all ~30 call sites migrated off the old `Primitive.tag` API. |
| 9 | Full primitives feature set: Layout (`Box`/`Flex`/`Grid`/`Stack`/`Inline`/`Center`/`Container`/`AspectRatio`), Text (`Text`/`Heading`/`Paragraph`/`Code`/`Pre`/`Link`), Accessibility (`VisuallyHidden`/`FocusScope`/`DismissibleLayer`/`Boundary`/`RovingFocusGroup`+`FocusItem`), Form (`Button`/`Input`/`Textarea`/`Label`/`Form`), Visibility (`Portal`/`Presence`/`Overlay`) | `packages/primitives/src/*` | See Part 2 for how each holds up against WAI-ARIA. |
| 10 | `useMutationObserver` hook | `packages/hooks/src/use-mutation-observer` | Joins the existing `useResizeObserver`/`useIntersectionObserver`. |
| 11 | TSDoc on every exported symbol, with `@example` | all 8 packages | Full pass completed this session (hooks → theme → headless → sections → layouts). |
| 12 | `packages/primitives/README.md` rewritten in your feature-bullet/emoji style | `packages/primitives/README.md` | Mirrors the structure you gave (🎯📝♿🎛️👁️🔗📡🎭). |
| 13 | Move the project to a new folder | now at `/Users/rajantripathi/Desktop/My-projects/nebula` | Reconnected and verified — files intact. |

### Partially covered — layer exists, most components in it don't yet

Per "cover all elements," every layer now has **real, non-stub content**, but several layers only have one representative component. Nothing below was explicitly promised on a timeline — flagging so you can prioritize:

- **`headless`**: only `Tabs` (+`TabList`/`Tab`/`TabPanel`) exists. `Accordion`, `Dialog`, `Switch`, `Checkbox`, `RadioGroup`, `Tooltip`, `Popover` are named in `component-library-architecture.md` §3 but not built.
- **`ui`**: only `Button` exists. Everything else in §4 (form controls, `Card`, `Dialog` chrome, etc.) not built.
- **`sections`**: only `ThemeSwitcher` exists. `LoginForm`, `TransactionForm`, etc. (§5) not built.
- **`layouts`**: only `AppLayout` exists. `DashboardLayout`, `AuthLayout`, `SettingsLayout` (§6) not built.
- **`theme`**: only one component-token set (`buttonTokens`) exists; other components will need their own set added when built.
- `headless`'s `Tabs` still hand-rolls its own roving-tabindex keyboard logic instead of consuming `primitives`' `RovingFocusGroup`/`FocusItem` (built later, in the same session) — noted in the code as a migration candidate, not yet done.

### Not started / explicitly out of scope so far

- **Automated testing.** Vitest/RTL/axe-core are not wired. Storybook `play` functions are the only behavioral verification that exists today; the `addon-a11y` panel is configured but nothing enforces it in CI (there is no CI).
- **Changesets / publishing pipeline.** Not wired — no versioning or npm publish flow exists yet.
- **Real install/build/typecheck/test execution.** This sandbox has no npm registry access (`403` on every `pnpm`/`npm`/`corepack` call), so nothing here has actually been run through `pnpm install && pnpm build`. All verification this session was static: JSON validity, brace-balance scripts, and `grep`-based import-graph audits. **This is the single biggest open risk — treat every package as "should work" rather than "verified to work" until you run a real install locally.**
- **SSR zero-flicker theming.** `ThemeProvider`'s doc comment describes the inline blocking-script workaround for SSR apps, but that script isn't implemented anywhere in this repo (there's no SSR app to put it in yet).
- **`prefers-reduced-motion` handling.** `Presence` (packages/primitives/src/presence) plays whatever CSS animation/transition the consumer defines with no reduced-motion short-circuit — flagged in Part 2.

---

## Part 2 — Standards conformance & international compliance analysis

### Which standards actually apply here

This is a UI component library, not a network service, so IETF RFCs (HTTP, TLS, etc.) aren't really in play. The two standards bodies that matter are:

- **W3C WAI-ARIA 1.2** — roles, states, and properties (`role`, `aria-*`).
- **W3C WCAG 2.2** (October 2023; adopted as **ISO/IEC 40500:2025** in October 2025) — the actual testable success criteria that "accessible" gets measured against. WCAG 2.0/2.1/2.2 are backward-compatible, so conforming to 2.2 also satisfies 2.1 and 2.0.

Component **libraries** don't get certified against WCAG directly — conformance is evaluated on the finished product built with the library — but a library can make conformance easy or hard to achieve. That's the right frame for everything below.

### Code-level audit against WAI-ARIA Authoring Practices

| Component | Pattern followed | Conformance notes |
| --- | --- | --- |
| `Tabs`/`TabList`/`Tab`/`TabPanel` | [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) | `role="tablist"`/`"tab"`/`"tabpanel"`, `aria-selected`, `aria-controls`/`aria-labelledby` cross-wiring, roving `tabIndex`, arrow/Home/End keys, both automatic and manual activation modes (the spec explicitly allows either). Correctly implemented. |
| `FocusScope` | Focus-management half of the [Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Moves focus in on mount, restores on unmount, optional Tab-cycle trap. It deliberately does **not** set `role="dialog"`/`aria-modal` itself — that's left to whatever consumes it, which is the correct separation (a headless focus primitive shouldn't assume it's always inside a dialog). Gap: no `Escape`-to-close is bundled here (that's `DismissibleLayer`'s job, correctly split out). |
| `DismissibleLayer` | Outside-dismiss half of the same pattern | Escape + outside-pointerdown, topmost-layer-only via a module-level stack — correct for nested overlays (popover-inside-dialog). |
| `RovingFocusGroup`/`FocusItem` | [Roving tabindex](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex) | Only one item is ever `tabIndex={0}`; arrow/Home/End move it; optional `loop`. Matches spec. |
| `Input`/`Textarea` | Form field semantics | `invalid` → `aria-invalid`, ref-forwarded for imperative focus. Doesn't itself render an error message region — by design, deferred to a future `FieldError` component (documented in the code). |
| `Label` | Explicit label association | Requires an explicit `htmlFor` (no auto-inference) — correct, since a wrong guess is worse than a missing one. `required` renders both a visual `*` (`aria-hidden`) and a screen-reader-only "(required)" string, which is the WCAG-recommended technique (a bare asterisk is not reliably announced). |
| `VisuallyHidden` | [WebAIM's `.sr-only` technique](https://webaim.org/techniques/css/invisiblecontent/) | Uses `clip: rect(0,0,0,0)` + 1px sizing rather than `display:none`, so it stays in the accessibility tree. This is the long-standing standard pattern (same one Radix/Reach UI use); the modern alternative is `clip-path`, but `clip` is still universally supported and this is a non-issue. |
| `Button` (ui layer) | Focus indicator (WCAG 2.4.7) | Ships `focus-visible:ring-2` sourced from the theme's `--color-border-focus` token — good, since `primitives`' own `Button` is unstyled and correctly leaves this to the styled layer. |
| `Boundary` | Not an ARIA pattern (React error boundary) | Included because you asked for it; not itself an accessibility concern, but a crashed subtree it catches should ideally render an accessible fallback (`role="alert"`) — not currently enforced, left to the consumer. |

**Two real gaps found:**

1. **`Presence` doesn't check `prefers-reduced-motion`.** It waits out whatever `animationend`/`transitionend` the consumer's CSS fires, with no short-circuit for users who've asked the OS to reduce motion. This maps to WCAG 2.3.3 (Animation from Interactions) — a **AAA**, not AA, criterion, so it's not blocking standard compliance, but it's a cheap, standard fix (wrap the animation-detection check in `matchMedia('(prefers-reduced-motion: reduce)')`).
2. **No automated accessibility testing.** Storybook's `addon-a11y` (axe-core under the hood) is configured but nothing runs it as a gate — there's no CI, and Vitest/RTL/axe aren't wired at all. Every conformance claim above is from manual code reading, not automated verification. Given how much of "did we actually meet WCAG" depends on runtime DOM state (computed contrast, actual focus order, live-region timing), this is the most important next investment if this library is meant to ship to real users.

Color contrast (WCAG 1.4.3, 4.5:1 for normal text) wasn't automatedly verified either — a spot check of `packages/theme/src/tokens/semantic.ts` shows the obvious pairs look fine (`gray-900` on `gray-50`, white text on `blue-600`), but this should go through an actual contrast checker once real UI ships, especially the `secondary`/`danger` button variants and any future lighter accent colors.

### International legal compliance landscape (as of mid-2026)

Accessibility law almost universally routes through WCAG rather than defining its own criteria, so the library's WCAG posture above is the thing that actually matters everywhere. Current state by region:

- **European Union — European Accessibility Act (EAA).** Enforcement began **June 28, 2025**; all 27 member states have transposed it into national law. It covers websites, apps, e-commerce, banking, and self-service terminals, and applies to **any company selling into the EU, including non-EU companies**. Conforming to **EN 301 549** (which itself incorporates WCAG 2.1 AA) creates a legal presumption of EAA compliance. Penalties are member-state-specific — from roughly €60,000 (Ireland) up to ~€900,000 (Sweden) — usually with a 30–90 day cure window before fines escalate. First lawsuits were filed in France in November 2025; more enforcement is expected through 2026.
- **United States — ADA + Section 508.** Section 508 (federal agencies/vendors) requires **WCAG 2.0/2.1 Level A+AA** per the 2018 Access Board refresh. A 2024 DOJ rule under **ADA Title II** now explicitly requires state/local government web content and apps to meet **WCAG 2.1 AA**, with compliance deadlines recently extended (large entities to April 2027, smaller/special-district entities to April 2028). ADA Title III (private businesses open to the public) has no codified technical standard, but courts overwhelmingly cite WCAG 2.1 AA in the >5,000 digital accessibility lawsuits filed in 2025 (a ~20% YoY increase). Notably, accessibility overlay widgets are explicitly called out as **not** a defensible substitute for actually-accessible markup — relevant since this library's approach (real ARIA roles, real keyboard handling) is the kind of thing that does hold up, unlike an overlay bolted on after the fact.
- **United Kingdom.** Public Sector Bodies Accessibility Regulations require **WCAG 2.1 AA** for public-sector sites/apps; the private sector is covered more loosely under the Equality Act 2010, but WCAG 2.1 AA is the de facto benchmark referenced in guidance and litigation.
- **Canada.** AODA (Ontario) requires **WCAG 2.0 AA**; the federal **Accessible Canada Act**, updated via new regulations in December 2025, expands digital accessibility duties for federally-regulated organizations, standardizing on **CAN/ASC – EN 301 549** (itself WCAG 2.1-based).
- **Australia.** The Disability Discrimination Act covers all sectors with no separate technical regulation, but the Australian Human Rights Commission's guidance and consistent tribunal outcomes point to **WCAG 2.0/2.1 AA** as the practical bar.

**Bottom line:** every jurisdiction that matters converges on the same target — **WCAG 2.1 AA (2.2 AA if you want to be ahead of the curve)**. Nothing found here is nebula-specific: there's no separate "compliance issue to use this in country X" the way there might be for, say, a payments library and PCI-DSS, or a health app and country-specific data-residency law. The relevant risk is entirely about whether **apps built with nebula** ship WCAG 2.1 AA-conforming UI, and the honest answer right now is: the ARIA/keyboard mechanics in the primitives are sound by manual review, but there is zero automated verification (no axe-core in CI, no contrast testing, no reduced-motion handling) to actually back that up before real users depend on it.

### Recommended next steps, in priority order

1. Wire `Vitest` + `@testing-library/react` + `axe-core` (`jest-axe`/`vitest-axe`) and gate the primitives/headless packages on it — this converts "looks compliant on read-through" into an enforced guarantee.
2. Add a `prefers-reduced-motion` check to `Presence`.
3. Run an actual `pnpm install && pnpm build` locally (this sandbox can't) before trusting any of the hand-authored `package.json`/`tsup.config.ts` files.
4. Run a contrast audit on `packages/theme/src/tokens/semantic.ts` (both themes) with a real tool (e.g. the axe or Storybook a11y addon's contrast checker) rather than eyeballing hex values.
5. If you intend this to ship into an EU-facing product, target EN 301 549 conformance explicitly (WCAG 2.1 AA is the core of it) — that's the one jurisdiction with active enforcement and real fines right now.

---

Sources:
- [WCAG 2.2 (W3C)](https://www.w3.org/TR/WCAG22/)
- [WCAG 2 Overview (W3C WAI)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [WAI-ARIA Authoring Practices Guide — Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WAI-ARIA Authoring Practices Guide — Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WAI-ARIA APG — Roving tabindex](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex)
- [WebAIM — Invisible Content Just for Screen Reader Users](https://webaim.org/techniques/css/invisiblecontent/)
- [European Accessibility Act guide (Level Access)](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/)
- [European Accessibility Act Goes Live (Davis Wright Tremaine)](https://www.dwt.com/insights/2025/07/european-accessibility-act-digital-products)
- [European Accessibility Act (European Commission)](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en)
- [2026 ADA Web Accessibility Standards & Requirements](https://www.accessibility.works/blog/wcag-ada-website-compliance-standards-requirements/)
- [ADA.gov — Web/Mobile App Accessibility Rule Fact Sheet](https://www.ada.gov/resources/2024-03-08-web-rule/)
- [Extension of ADA Title II Compliance Dates (Federal Register)](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web)
- [Global Accessibility Regulation Timeline (TestParty)](https://testparty.ai/blog/global-accessibility-regulations)
- [Canadian Web Accessibility Laws: AODA and the Accessible Canada Act](https://achecker.ca/blog/canadian-accessibility-laws-aoda-aca)
