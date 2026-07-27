# Dashboard UI Template

An example CSR dashboard app built entirely from `@nebula-lab/react-ui` and `@nebula-lab/react-ui-blocks` — a starting point to fork for a real product, not a published package.

Pages: Overview (metrics + charts), Users (searchable/sortable table), Team (member grid), Billing (usage, plans, payment methods). Desktop nav via `Sidebar`/`SideNav`; a `SaasAppHeader` provides the mobile nav fallback below the `md` breakpoint.

## Run it

```bash
pnpm --filter dashboard-ui-template dev
```

Opens on http://localhost:5180.

## Why `@source` is in `src/index.css`

Tailwind v4's automatic content detection only scans this app's own directory. Every nebula component's utility classes live in `@nebula-lab/react-ui`'s and `@nebula-lab/react-ui-blocks`'s *built* `dist` output (what each package's `exports` map actually resolves to, even inside this pnpm workspace) — so those two `@source` lines are what make components render styled at all. If you copy this template out of the monorepo to start a real project, replace those two lines with `@source` pointing at wherever your installed `node_modules/@nebula-lab/*` packages live (their `dist` folders still contain the same class strings — `node_modules` isn't scanned by default either).
