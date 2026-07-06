
import { Primitive } from '@nebula/primitives/primitive';
import { ThemeProvider } from '@nebula/react-ui';
import * as React from 'react';

import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

import type { Theme } from '@nebula/react-ui';


const PORTAL_ROOT_ID = 'nebula-portal-root';

interface AppLayoutProps {
  children: React.ReactNode;
  /** Rendered in the header, left of the theme switcher. */
  title?: React.ReactNode;
  /** @default 'system' */
  defaultTheme?: Theme;
  /** Hide the built-in header (e.g. a consumer app supplying its own). */
  hideHeader?: boolean;
}

/**
 * Root shell: wraps the app in `ThemeProvider`, renders a minimal header
 * (title + `ThemeSwitcher`), a main content region, and a portal-root `div`
 * that `Dialog`/`Popover`/`Toast` (once built) render into via
 * `@nebula/primitives`' `Portal` — so every overlay in the app shares one
 * DOM mount point instead of each component picking its own.
 *
 * This is intentionally minimal — `DashboardLayout`/`AuthLayout`/
 * `SettingsLayout` (component-library-architecture.md §6) compose on top of
 * this rather than duplicating the provider/portal-root setup.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AppLayout title="Acme Admin" defaultTheme="dark">
 *       <Dashboard />
 *     </AppLayout>
 *   );
 * }
 * ```
 */
function AppLayout({ children, title, defaultTheme = 'system', hideHeader = false }: AppLayoutProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <Primitive
        as="div"
        className="flex min-h-screen flex-col bg-[var(--color-base-100)] text-[var(--color-base-content)]"
      >
        {hideHeader ? null : (
          <Primitive
            as="header"
            className="flex items-center justify-between border-b border-[var(--color-base-300)] px-6 py-3"
          >
            <div className="text-sm font-semibold">{title}</div>
            <ThemeSwitcher />
          </Primitive>
        )}
        <Primitive as="main" className="flex-1">
          {children}
        </Primitive>
        <div id={PORTAL_ROOT_ID} />
      </Primitive>
    </ThemeProvider>
  );
}

export { AppLayout, PORTAL_ROOT_ID };
export type { AppLayoutProps };
