import { cn } from '@nebula/primitives/cn';
import { Main, Section, Sidebar } from '@nebula/react-ui';
import * as React from 'react';

import { AppLayout } from '../app-layout/app-layout';

import type { Theme } from '@nebula/react-ui';

interface SettingsLayoutProps {
  /** The settings page's own content — usually a stack of `Section`s, one per settings panel (profile, security, billing, ...). */
  children: React.ReactNode;
  /**
   * The settings section nav (a flat list of links/buttons — "Profile",
   * "Security", "Billing", ...) — semantically distinct from
   * `DashboardLayout`'s `sidebar` prop even though both render inside the
   * same `Sidebar` component: a settings nav is a flat, page-scoped section
   * list, never the app's primary navigation, which is exactly why this is
   * its own named component rather than `DashboardLayout` with a `variant`
   * prop (mirrors why this project keeps `Dialog`/`AlertDialog` conceptually
   * distinct even when visually similar).
   */
  sidebar: React.ReactNode;
  title?: React.ReactNode;
  /** @default 'system' */
  defaultTheme?: Theme;
  className?: string;
}

/**
 * Settings-section sidebar + capped-width content panel — structurally the
 * same `Sidebar`+`Main` composition `DashboardLayout` uses (see that
 * component's doc comment for the same "sidebar ends up nested inside
 * `AppLayout`'s `<main>`" trade-off, which applies here identically), but
 * kept as its own component because a settings nav and a primary app nav
 * are different content models, not just different skins on one block —
 * the same rule `BLOCKS_ARCHITECTURE.md` §5 uses to decide when something
 * needs to be a separate family vs. a shared component with a variant prop.
 *
 * Content is capped to `max-w-2xl` and centered within `Main` — unlike
 * `DashboardLayout`'s content (which is often wide widget grids/tables), a
 * settings panel is almost always a single column of stacked form sections,
 * and a full-bleed-width settings form reads worse on a wide viewport.
 *
 * @example
 * ```tsx
 * <SettingsLayout
 *   title="Settings"
 *   sidebar={<SettingsNav />}
 * >
 *   <Section aria-labelledby="profile-heading">
 *     <h2 id="profile-heading">Profile</h2>
 *     ...
 *   </Section>
 * </SettingsLayout>
 * ```
 */
function SettingsLayout(props: SettingsLayoutProps) {
  const { children, sidebar, title, defaultTheme, className } = props;

  return (
    <AppLayout title={title} defaultTheme={defaultTheme}>
      <div className={cn('flex min-h-full', className)}>
        <Sidebar aria-label="Settings">{sidebar}</Sidebar>
        <Main>
          <Section className="mx-auto max-w-2xl">{children}</Section>
        </Main>
      </div>
    </AppLayout>
  );
}

export { SettingsLayout };
export type { SettingsLayoutProps };
