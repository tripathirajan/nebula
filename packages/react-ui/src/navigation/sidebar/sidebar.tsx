import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface SidebarOwnProps {
  /** Which edge the border (and, by convention, this sidebar) sits on. @default 'left' */
  side?: 'left' | 'right';
  /**
   * Shrinks the rail from `w-64` (256px) to `w-16` (64px) — an icon-only
   * collapsed state, the same pattern `BottomNavItem`'s icon/label pairing
   * already uses at phone width, applied here for a consumer that wants to
   * reclaim horizontal space on desktop too. `Sidebar` only controls the
   * container's width/transition; it has no opinion on what's inside, so
   * adapting content (hiding nav-item labels, switching a wordmark to a
   * mark-only logo, ...) for the collapsed width is the consumer's own job —
   * read `data-state` (`"collapsed"` / `"expanded"`) off this element, or
   * just thread the same boolean the consumer is already holding into its
   * own child content.
   * @default false
   */
  collapsed?: boolean;
}

type SidebarProps = PrimitivePropsWithRef<'aside'> & SidebarOwnProps;

/**
 * A fixed-width `<aside>` for app navigation/filters — `side` only flips
 * which edge gets the border (`border-r` for a left sidebar, `border-l` for
 * a right one); actual page placement is the consumer's own layout (flex/
 * grid) concern, same as every other component here not hardcoding position.
 *
 * Hidden below `md` by default (`hidden md:flex`), the same breakpoint
 * `BottomNav` uses in reverse (`md:hidden` — see `bottom-nav.tsx`'s own doc
 * comment). A fixed w-64 (256px) side rail is a desktop nav pattern; without
 * this, a consumer pairing `Sidebar` (via `DashboardLayout`/`SettingsLayout`)
 * with `BottomNav` for phone-width nav got *both* rendered at once below
 * `md` — confirmed via a real consumer (`expensiona`): on a ~480px
 * viewport the sidebar's 256px ate over half the screen, squeezing page
 * content into a column so narrow ordinary sentences wrapped one word per
 * line. `Sidebar` owns this breakpoint itself (rather than leaving each
 * layout that uses it to remember to add it) so it's correct by default
 * everywhere, the same reasoning `BottomNav` already applies to its own side
 * of this pairing.
 *
 * @example
 * ```tsx
 * <div className="flex">
 *   <Sidebar>
 *     <nav>...</nav>
 *   </Sidebar>
 *   <Main>...</Main>
 * </div>
 * ```
 */
const Sidebar = React.forwardRef<HTMLElement, SidebarProps>((props, forwardedRef) => {
  const { className, side = 'left', collapsed = false, ...rest } = props;
  return (
    <Primitive
      as="aside"
      data-state={collapsed ? 'collapsed' : 'expanded'}
      className={cn(
        'hidden shrink-0 flex-col gap-1 bg-[var(--sidebar-bg)] p-4 text-[var(--sidebar-text)] transition-[width] duration-200 md:flex',
        collapsed ? 'w-16' : 'w-64',
        side === 'left' ? 'border-r border-[var(--sidebar-border)]' : 'border-l border-[var(--sidebar-border)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Sidebar.displayName = 'Sidebar';

export { Sidebar };
export type { SidebarProps };
