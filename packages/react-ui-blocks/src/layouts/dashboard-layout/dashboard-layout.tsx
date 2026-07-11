import { cn } from '@nebula/primitives/cn';
import { Main, Sidebar } from '@nebula/react-ui';
import * as React from 'react';

import { AppLayout } from '../app-layout/app-layout';

import type { Theme } from '@nebula/react-ui';

interface DashboardLayoutProps {
  children: React.ReactNode;
  /** The primary app navigation — rendered inside a `Sidebar`. */
  sidebar: React.ReactNode;
  title?: React.ReactNode;
  /** @default 'system' */
  defaultTheme?: Theme;
  className?: string;
}

/**
 * Sidebar + header + content shell for an internal app/admin home screen —
 * composes on top of `AppLayout` (per that component's own doc comment)
 * rather than re-wiring `ThemeProvider`/the portal-root from scratch, adding
 * only a `Sidebar` alongside the content region.
 *
 * The `Sidebar` ends up nested inside `AppLayout`'s `<main>` landmark (since
 * `AppLayout` always wraps its `children` in one) rather than as a sibling
 * landmark of it — a deliberate, documented trade-off: composing through
 * `AppLayout`'s single `children` slot avoids a second copy of the
 * provider/portal-root setup, at the cost of a `<aside>` that reads as
 * page-specific complementary content nested in `<main>` rather than a
 * top-level landmark. This is valid HTML5 and matches how many real
 * dashboard shells structure this region; a consumer who specifically wants
 * `Sidebar` as a true page-level sibling landmark can render it directly
 * around `AppLayout` (passing `hideHeader` and rolling their own header)
 * instead of using this component.
 *
 * @example
 * ```tsx
 * <DashboardLayout title="Acme Admin" sidebar={<PrimaryNav />}>
 *   <StatCards />
 * </DashboardLayout>
 * ```
 */
function DashboardLayout(props: DashboardLayoutProps) {
  const { children, sidebar, title, defaultTheme, className } = props;

  return (
    <AppLayout title={title} defaultTheme={defaultTheme}>
      <div className={cn('flex min-h-full', className)}>
        <Sidebar>{sidebar}</Sidebar>
        <Main>{children}</Main>
      </div>
    </AppLayout>
  );
}

export { DashboardLayout };
export type { DashboardLayoutProps };
