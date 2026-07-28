# Component Coverage Audit

_Superseded 2026-07-19. The original audit (a checklist against a full "Radix + Chakra + Mantine combined" wishlist scope, ~270 line items across Primitive/Headless/react-ui) tracked its own progress via a "Highest-leverage gaps" section — by the end of that tracking, all seven gap batches were marked done, and cross-checking its last remaining claims (`Alert`, `EmptyState` "missing") against the actual `packages/react-ui/src` tree found both already exist. The checklist had fully served its purpose and gone stale in the process, so it's replaced here rather than kept as a 37KB doc requiring line-by-line re-verification._

## Current state

Primitive, Headless, and react-ui all cover their originally-scoped wishlist essentially completely — see `AGENTS.md`'s status table and each package's own `README.md` for the real, current component inventory (categorized, not a checkbox grid). The only components ever explicitly deferred:

- **`QRCode`** — deliberate, documented scope cut (out of scope for this library).
- A few small naming reconciliations rather than real gaps: `Separator` covers what the original wishlist called "Divider"; `Dialog` covers "Modal"; `react-ui-blocks`' `layouts` vertical (`AppLayout`/`AuthLayout`/`DashboardLayout`/`SettingsLayout`) covers "AppShell" at the composed-block level rather than as a single `react-ui` atom.

## Pending

The `styleless` layer extraction (see `AGENTS.md`'s status table and `LAYER_TAXONOMY.md` §4) remains outstanding. Two new, real, concrete gaps were found 2026-07-28 re-auditing `primitives`/`headless`/`styleless` against what `react-ui` actually exports (not the original wishlist, which is why the "essentially complete" claim above missed them) — tracked below with the plan to close them.

### A. Real component gaps — primitives/styleless with no react-ui wrapper

Confirmed by diffing every folder in `packages/{primitives,headless,styleless}/src` against `packages/react-ui/src`. `headless` has zero real gaps (`listbox` is `Select`/`Combobox`/`Autocomplete`'s internal engine, never meant to be styled standalone).

**Layout primitives (11) — react-ui exposes none of these today:**
- [x] `AspectRatio` — wraps `primitives/aspect-ratio`
- [x] `Center` — wraps `primitives/center`
- [x] `Container` — wraps `primitives/container`
- [x] `Flex` — wraps `primitives/flex`
- [x] `Grid` — wraps `primitives/grid`
- [x] `HStack` — wraps `primitives/hstack`
- [x] `VStack` — wraps `primitives/vstack`
- [x] `Stack` — wraps `primitives/stack`
- [x] `Inline` — wraps `primitives/inline`
- [x] `Wrap` — wraps `primitives/wrap`
- [x] `Spacer` — wraps `primitives/spacer`

**Other real gaps (6):**
- [x] `Image` — wraps `primitives/image`; no styled bare-image atom exists (`image-upload`/`image-preview` exist but aren't this)
- [x] `Label` — wraps `primitives/label`; only `FieldLabel` exists today, no standalone atom for non-`Field` contexts
- [x] `Link` — wraps `primitives/link`; no styled text-link atom (confirmed: had to fall back to a raw `<a>` with hand-written classes in `templates/expensiona-desktop/src/pages/AccountDetail.tsx` for exactly this reason)
- [x] `NativeSelect` — wraps `primitives/native-select`; no styled native `<select>` (confirmed: hand-wrote a raw `<select>` in `templates/expensiona-desktop/src/components/QuickTransferCard.tsx` for exactly this reason). Matches MUI's own `NativeSelect`/`Select` split naming.
- [x] `Form` — wraps `primitives/form`; no styled `<form>` wrapper
- [x] `ImagePreview` — `styleless/image-preview` exists and is already used internally by `ImageUpload`, but has no standalone `@nebula-lab/react-ui/image-preview` export for a bare preview-only use case

Each is a thin styled wrapper (same pattern as `primitives/text` → `react-ui/text`) — scaffold via the `new-component` skill, no new design decisions needed per component.

### B. react-ui-blocks → react-ui: generic molecules, decided 2026-07-28

**Move to `react-ui` as molecules (14)**, each gaining an additive `classNames` slot-map prop (e.g. `classNames={{ root, item }}`) so consumers can restyle sub-parts without forking — the concrete fix for "no way to override `PaymentMethodList`'s row styling". Pilot batch done 2026-07-28 (proved the scaffold + `classNames` pattern, consumers repointed, both packages re-verified clean):
- [x] `CardListItem` — `classNames`: `root`/`avatar`/`icon`/`content`/`title`/`description`/`trailing`/`actionsTrigger`
- [x] `PaymentMethodList` — `classNames`: `root`/`header`/`title`/`list`/`item`/`icon`/`brand`/`badge`/`expiry`/`actionsTrigger`/`addButton`
- [ ] `ListingCard`
- [ ] `ChartCard`
- [ ] `BalanceCard`
- [ ] `BillingSummaryCard`
- [ ] `TeamMemberCard`
- [ ] `DashboardOverview`
- [ ] `ThumbnailList`
- [ ] `RankedList`
- [ ] `ReviewsList`
- [ ] `WelcomeBanner`
- [ ] `PlanCards`
- [ ] `ProfileHeader`

**Delete outright (4) — not moved anywhere:**
- [ ] `AuthSplitLayout` — page/view-level (owns a whole two-panel page shell), not an organism; templates compose their own pages
- [ ] `EntityFormLayout` — same reason, confirmed page-level (avatar/toggle/danger-action shell + consumer field grid)
- [ ] `TransactionForm` — domain-specific (finance-flavored income/expense entry); forms don't belong as shipped molecules at all (MUI ships zero pre-shaped forms for the same reason — field/validation/layout varies too much to generalize). `templates/expensiona-desktop`'s own `TransactionFormDialog`, built from primitives directly, already proves this out — it does far more (transfers, accounts, receipts, recurring) than a shared `TransactionForm` ever could.
- [ ] `ProductCard` — merged into `ListingCard` (identical shape: image + title + price/meta); give `ListingCard` optional generic `badge`/`meta`/`rating` slots instead of shipping a separate e-commerce-named component

**Stays in react-ui-blocks as organisms (10):** `SaasAppHeader`, `LoginForm`, `SignupForm`, `Hero`, `PromoBanner`/`PromoBannerCarousel`, `ChatWindow`, `NotificationCenter`, `ProductGallery`, `ProductInfoPanel`, `DataTableBlock`.

### C. Package structure — decided 2026-07-28

Not splitting `react-ui` into per-category packages. It already ships tree-shakeable per-component exports (`@nebula-lab/react-ui/<name>`, one tsup entry each), which already solves the real bundle-size concern; a package split would only trade a navigation annoyance for real costs (ambiguous category boundaries, a token/theme package of its own, multiplying the independent-publish cascade complexity onto 10+ packages). If folder navigability becomes the actual pain later, reorganize `src/` into category subfolders inside the same package instead — no consumer-facing change.

### D. Folder arrangement for the 31 new/moved components — decided 2026-07-28

Not reorganizing the existing ~100 `packages/react-ui/src` components — that's a separate, higher-risk migration (moving stable files, updating every import across stories/tests/consumers) with no urgency. Instead, every component newly created by §A/§B lands directly in a category subfolder from the start, since it costs nothing (nothing existing moves) and gets the navigability win where it actually matters right now. Export paths are unaffected — still flat `@nebula-lab/react-ui/<name>` regardless of `src/` folder depth.

- `layout/` (11) — AspectRatio, Center, Container, Flex, Grid, HStack, VStack, Stack, Inline, Wrap, Spacer
- `typography/` (2) — Label, Link
- `media/` (2) — Image, ImagePreview
- `forms/` (2) — NativeSelect, Form
- `data-display/` (14, the §B moves) — CardListItem, ListingCard, ChartCard, BalanceCard, BillingSummaryCard, TeamMemberCard, DashboardOverview, ThumbnailList, RankedList, ReviewsList, WelcomeBanner, PlanCards, PaymentMethodList, ProfileHeader

Whether the existing ~100 ever join this structure is a future, separate decision — left flat for now.

### Execution order

1. ~~Scaffold the 17 primitives/styleless gaps (§A) into their §D category subfolders~~ — done.
2. ~~Pilot 2 of the 14 §B moves (`CardListItem`, `PaymentMethodList`) into `data-display/` to prove the scaffold + `classNames` pattern~~ — done 2026-07-28.
3. Batch the remaining 12 §B moves into `data-display/`.
4. Repoint every consumer (react-ui-blocks' own `compositions/*.stories.tsx`, both `templates/expensiona-*` apps) off the old `@nebula-lab/react-ui-blocks` paths.
5. Delete the 4 §B removals and their old source folders; update both packages' barrels/`exports` maps.
6. Update `AGENTS.md`, `component-library-architecture.md`, `BLOCKS_ARCHITECTURE.md`, both packages' `README.md`.
7. Full verify: build/test/lint/typecheck both packages, Storybook spot-check, both templates typecheck + browser pass.
8. Major-version bump + changelog for both `react-ui` and `react-ui-blocks`.
