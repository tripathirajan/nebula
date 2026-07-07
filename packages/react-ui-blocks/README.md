# @nebula/react-ui-blocks

Ready-to-use, domain-neutral screens and composite blocks — built purely from `@nebula/react-ui` (never new primitives or raw DOM). The top of the dependency graph: nothing else in this repo depends on it.

This package merges what used to be two separate packages, `sections` (composite product-flavored blocks) and `layouts` (page-level shells) — both had the exact same dependency shape (`react-ui`, nothing above them) and the same "assemble ready-made UI out of the lower layers" purpose, so keeping them split added a package boundary without adding a real architectural distinction. Deliberately **not** ecommerce- or any other domain-specific — a dashboard shell and a theme switcher are just as useful to an expense-tracker PWA as to a storefront. If a genuinely domain-specific vertical (ecommerce blocks, say) becomes worth shipping, that's a good candidate for its own separate package built on top of this one later, rather than folding domain-specific components in here.

## What's here

- `ThemeSwitcher` — light/dark/system toggle built on `@nebula/react-ui`'s `Button` and `useTheme`. Must render inside a `ThemeProvider`.
- `AppLayout` — root shell: `ThemeProvider`, a minimal header (title + `ThemeSwitcher`), a `Primitive.main` content region, and a `#nebula-portal-root` div for `Dialog`/`Popover`/`Toast` to portal into.
- `LoginForm` — email/password sign-in card (`Card`+`Field`+`Input`+`PasswordField`+`Checkbox`+`Button`); does no validation of its own, hands `{email, password, remember}` to `onSubmit`.
- `TransactionForm` — generic income/expense entry form (`Select` for a consumer-supplied `categories` list, `DatePicker`, a `ToggleGroup` for income/expense); deliberately not ecommerce-specific, same domain-neutral rule as the rest of this package.
- `DashboardLayout` — `Sidebar` + header + content shell for an internal app/admin home screen, composed on top of `AppLayout`.
- `AuthLayout` — centered-card page shell (header hidden) for sign-in/sign-up/password-reset flows, composed on top of `AppLayout`.
- `SettingsLayout` — settings-nav `Sidebar` + capped-width content panel, composed on top of `AppLayout`; kept distinct from `DashboardLayout` since a settings nav and a primary app nav are different content models, not just a shared component with a variant prop.

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
import { LoginForm } from '@nebula/react-ui-blocks/login-form';
import { TransactionForm } from '@nebula/react-ui-blocks/transaction-form';
import { DashboardLayout } from '@nebula/react-ui-blocks/dashboard-layout';
import { AuthLayout } from '@nebula/react-ui-blocks/auth-layout';
import { SettingsLayout } from '@nebula/react-ui-blocks/settings-layout';
```

## Still to build

Per `component-library-architecture.md` §5/§6 and `BLOCKS_ARCHITECTURE.md`'s Phase 1 list: `SignupForm`, `ChartCard`, `FilterBar`, `NotificationCenter`. Compose new layouts on top of `AppLayout` rather than re-wiring `ThemeProvider`/portal-root from scratch; add new sections here following the same file-per-component convention as everything else.
