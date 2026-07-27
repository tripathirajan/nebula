# Mobile UI Template

An example CSR mobile-app UI built entirely from `@nebula-lab/react-ui` and `@nebula-lab/react-ui-blocks` — a starting point to fork for a real product, not a published package.

Tabs: Home (balance + accounts + recent transactions), Cards (saved payment methods), Stats (spend chart + category breakdown), Profile (appearance + sign out). Navigation is `BottomNav`, which is `md:hidden` by design (a phone-width pattern) — **view this at a narrow viewport** (resize your browser below 768px, or a real phone/simulator) or the tab bar won't render.

## Run it

```bash
pnpm --filter mobile-ui-template dev
```

Opens on http://localhost:5181.

## Why `@source` is in `src/index.css`

See `templates/dashboard-ui/README.md`'s note — same reason, same fix if you copy this template out of the monorepo.
