# @nebula-lab/react-ui-blocks

Ready-to-use, domain-neutral screens and composite blocks — built purely from `@nebula-lab/react-ui` (never new primitives or raw DOM). The top of the dependency graph: nothing else in this repo depends on it.

This package merges what used to be two separate packages, `sections` (composite product-flavored blocks) and `layouts` (page-level shells) — both had the exact same dependency shape (`react-ui`, nothing above them) and the same "assemble ready-made UI out of the lower layers" purpose, so keeping them split added a package boundary without adding a real architectural distinction. Deliberately **not** ecommerce- or any other domain-specific — a dashboard shell and a theme switcher are just as useful to an expense-tracker PWA as to a storefront. If a genuinely domain-specific vertical (ecommerce blocks, say) becomes worth shipping, that's a good candidate for its own separate package built on top of this one later, rather than folding domain-specific components in here.

## Installation

```bash
npm install @nebula-lab/react-ui-blocks
# or
yarn add @nebula-lab/react-ui-blocks
# or
pnpm add @nebula-lab/react-ui-blocks
# or
bun add @nebula-lab/react-ui-blocks
```

Peer dependencies: `react ^19.0.0`, `react-dom ^19.0.0`. Also pulls in `recharts` for the chart blocks. npm is shown first since it ships with Node.js and remains the most widely used option, but yarn, pnpm, and bun all work identically.

**Module format:** ESM only (no CommonJS build). Works out of the box with any bundler (Vite, Next.js, Webpack 5+, esbuild, Parcel) or native Node.js ESM. A plain CommonJS `require('@nebula-lab/react-ui-blocks')` is **not** supported and throws `ERR_REQUIRE_ESM` — use `import` (or dynamic `import()` from a CJS file) instead.

**TypeScript / JavaScript:** Ships hand-written `.d.ts` types alongside the JS output, but nothing requires TypeScript — plain JavaScript works identically (props just won't be type-checked/autocompleted without a TS-aware editor).

## What's here

Domain-neutral blocks (layouts, forms, data display, navigation) are exported from the package root. Domain-flavored verticals (authentication, dashboard, ecommerce, marketing, communication, social) each have their own subpath — see Import below.

**Layouts** — `AppLayout` (root shell: `ThemeProvider`, header, content region, portal root for `Dialog`/`Popover`/`Toast`), `DashboardLayout`, `AuthLayout`, `SettingsLayout`, `PageSection`

**Forms** — `TransactionForm` (generic income/expense entry, category list supplied by the consumer), `EntityFormLayout`

**Data display** — `DataTableBlock`, `ListingCard`, `CardListItem`

**Navigation** — `SaasAppHeader`

**Authentication** (`@nebula-lab/react-ui-blocks/authentication`) — `LoginForm`, `SignupForm`

**Dashboard** (`@nebula-lab/react-ui-blocks/dashboard`) — `DashboardOverview`, `ChartCard`, `WelcomeBanner`, `BalanceCard`, `BillingSummaryCard`, `PaymentMethodList`, `PlanCards`, `RankedList`, `ReviewsList`, `TeamMemberCard`, `ThumbnailList`

**Ecommerce** (`@nebula-lab/react-ui-blocks/ecommerce`) — `ProductCard`, `ProductGallery`, `ProductInfoPanel`

**Marketing** (`@nebula-lab/react-ui-blocks/marketing`) — `Hero`, `PromoBanner`, `PromoBannerCarousel`

**Communication** (`@nebula-lab/react-ui-blocks/communication`) — `ChatWindow`, `NotificationCenter`

**Social** (`@nebula-lab/react-ui-blocks/social`) — `ProfileHeader`

**Flagship compositions** — full example screens combining many blocks (SaaS dashboard home, mobile banking, invoice list, product details, analytics overview, transaction list, user list, banking home) — Storybook-only, see the `compositions` stories rather than importable exports.

## Import

```tsx
import { AppLayout } from '@nebula-lab/react-ui-blocks';
import { ThemeSwitcher } from '@nebula-lab/react-ui';
import '@nebula-lab/react-ui/theme.css';

function App() {
  return (
    <AppLayout title="My App">
      <YourPage />
    </AppLayout>
  );
}
```

Vertical-specific blocks come from their own subpath, not the root barrel:

```ts
import { LoginForm, SignupForm } from '@nebula-lab/react-ui-blocks/authentication';
import { DashboardOverview, ChartCard } from '@nebula-lab/react-ui-blocks/dashboard';
import { ProductCard } from '@nebula-lab/react-ui-blocks/ecommerce';
import { Hero, PromoBanner } from '@nebula-lab/react-ui-blocks/marketing';
import { ChatWindow, NotificationCenter } from '@nebula-lab/react-ui-blocks/communication';
import { ProfileHeader } from '@nebula-lab/react-ui-blocks/social';
```

## API reference

Every block here ships with a live Storybook entry — that's the authoritative API reference, not this README: **https://tripathirajan.github.io/nebula/**

## Contributing

See the [monorepo's CONTRIBUTING.md](../../CONTRIBUTING.md). Compose new layouts on top of `AppLayout` rather than re-wiring `ThemeProvider`/portal-root from scratch, and keep new blocks domain-neutral in the root barrel or under the matching vertical subpath.

## License

MIT
