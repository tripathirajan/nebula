# Expensiona — Desktop Template

An example CSR expense-tracker/budget-planner app (a "money manager" style admin + reporting UI) built entirely from `@nebula-lab/react-ui` and `@nebula-lab/react-ui-blocks` — a starting point to fork for the real `expensiona` app, not a published package. Mock data only, no backend/auth wired in.

Pages: Overview (balance/income/expense/savings metrics + income-vs-expense and spend-by-category charts), Transactions (searchable/sortable table with income/expense/transfer tabs), Accounts (account balances + linked cards), Budgets (per-category spend vs cap for the current cycle). Desktop nav via `Sidebar`/`SideNav`; a `SaasAppHeader` provides the mobile nav fallback below the `md` breakpoint.

See `templates/expensiona-mobile` for the companion restricted-scope mobile app (quick transaction entry + budget checking, no admin/reporting).

## Run it

```bash
pnpm --filter expensiona-desktop-template dev
```

Opens on http://localhost:5180.

## Why `@source` is in `src/index.css`

Tailwind v4's automatic content detection only scans this app's own directory. Every nebula component's utility classes live in `@nebula-lab/react-ui`'s and `@nebula-lab/react-ui-blocks`'s *built* `dist` output (what each package's `exports` map actually resolves to, even inside this pnpm workspace) — so those two `@source` lines are what make components render styled at all. If you copy this template out of the monorepo to start a real project, replace those two lines with `@source` pointing at wherever your installed `node_modules/@nebula-lab/*` packages live (their `dist` folders still contain the same class strings — `node_modules` isn't scanned by default either).
