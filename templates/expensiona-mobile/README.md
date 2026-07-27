# Expensiona — Mobile Template

An example CSR mobile app for `expensiona` — restricted-scope quick transaction entry and budget checking, no admin/reporting (see `templates/expensiona-desktop` for that) — built entirely from `@nebula-lab/react-ui` and `@nebula-lab/react-ui-blocks`. A starting point to fork, not a published package. Mock data only, no backend/auth wired in.

Tabs: Home (balance + accounts + recent transactions), Transactions (quick list + add), Budget (spend chart + category breakdown), Profile (appearance + sign out). Navigation is `BottomNav`, which is `md:hidden` by design (a phone-width pattern) — **view this at a narrow viewport** (resize your browser below 768px, or a real phone/simulator) or the tab bar won't render.

## Run it

```bash
pnpm --filter expensiona-mobile-template dev
```

Opens on http://localhost:5181.

## Why `@source` is in `src/index.css`

See `templates/expensiona-desktop/README.md`'s note — same reason, same fix if you copy this template out of the monorepo.
