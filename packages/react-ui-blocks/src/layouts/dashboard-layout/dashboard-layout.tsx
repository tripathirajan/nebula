import { cn } from '@nebula/primitives/cn';
import { Sidebar } from '@nebula/react-ui/sidebar';
import * as React from 'react';

import { AppLayout } from '../app-layout/app-layout';

import type { Theme } from '@nebula/react-ui/theme-provider';

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
 * The content region deliberately uses a plain `<div>` (`Main`'s own
 * `flex-1 p-4` classes, hand-applied) rather than `react-ui`'s `Main`
 * component — `Main` renders its own `<main>` landmark, and nesting one
 * inside `AppLayout`'s already-rendered `<main>` is a real WCAG violation
 * (duplicate/non-top-level main landmarks), not just a stylistic choice
 * like the `Sidebar` trade-off above.
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
        <div className="flex-1 p-4">{children}</div>
      </div>
    </AppLayout>
  );
}

export { DashboardLayout };
export type { DashboardLayoutProps };
