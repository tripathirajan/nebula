# @nebula/react-ui-blocks

Ready-to-use, domain-neutral screens and composite blocks — built purely from `@nebula/react-ui` (never new primitives or raw DOM). The top of the dependency graph: nothing else in this repo depends on it.

This package merges what used to be two separate packages, `sections` (composite product-flavored blocks) and `layouts` (page-level shells) — both had the exact same dependency shape (`react-ui`, nothing above them) and the same "assemble ready-made UI out of the lower layers" purpose, so keeping them split added a package boundary without adding a real architectural distinction. Deliberately **not** ecommerce- or any other domain-specific — a dashboard shell and a theme switcher are just as useful to an expense-tracker PWA as to a storefront. If a genuinely domain-specific vertical (ecommerce blocks, say) becomes worth shipping, that's a good candidate for its own separate package built on top of this one later, rather than folding domain-specific components in here.

## What's here

- `ThemeSwitcher` — light/dark/system toggle built on `@nebula/react-ui`'s `Button` and `useTheme`. Must render inside a `ThemeProvider`.
- `AppLayout` — root shell: `ThemeProvider`, a minimal header (title + `ThemeSwitcher`), a `Primitive.main` content region, and a `#nebula-portal-root` div for `Dialog`/`Popover`/`Toast` to portal into.

## Import

```tsx
import { AppLayout, ThemeSwitcher } from '@nebula/react-ui-blocks';
import '@nebula/react-ui/theme.css';

function App() {
  return (
    <AppLayout title="My App">
      <YourPage />
    </AppLayout>
  );
}
```

Or per-component subpath:

```ts
import { ThemeSwitcher } from '@nebula/react-ui-blocks/theme-switcher';
import { AppLayout } from '@nebula/react-ui-blocks/app-layout';
```

## Still to build

Per `component-library-architecture.md` §5/§6 (written when this was still two packages — read both sections, the split no longer applies): `LoginForm`, `SignupForm`, `TransactionForm`/`TransactionTable`, `ChartCard`, `FilterBar`, `NotificationCenter`, `DashboardLayout`, `AuthLayout`, `SettingsLayout`. Compose new layouts on top of `AppLayout` rather than re-wiring `ThemeProvider`/portal-root from scratch; add new sections here following the same file-per-component convention as everything else.
