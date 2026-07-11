import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type BottomNavProps = PrimitivePropsWithRef<'nav'>;

/**
 * A fixed, mobile-only tab bar — `<nav>` landmark pinned to the viewport
 * bottom, hidden at `md:` and above (this is a phone-width navigation
 * pattern; wider viewports should use `Sidebar`/`Navbar` instead). Padding
 * includes `env(safe-area-inset-bottom)` so content isn't obscured by an
 * iOS home-indicator or Android gesture bar. `z-40` is deliberately below
 * every floating overlay in this package (`Dialog`/`Drawer`/`Toast`/etc. all
 * use `z-50`), so those always stack above the tab bar.
 *
 * No compound context/state machine — `BottomNavItem`'s `active` prop is
 * just a boolean the consumer already knows (from their router), same
 * "presentational, not stateful" shape a plain nav landmark needs, not
 * `Tabs`' context-driven active-index tracking.
 *
 * @example
 * ```tsx
 * <BottomNav>
 *   <BottomNavItem icon={<HomeIcon />} label="Home" active href="/" />
 *   <BottomNavItem icon={<SearchIcon />} label="Search" href="/search" />
 * </BottomNav>
 * ```
 */
const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="nav"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t bg-(--bottom-nav-bg) text-(--bottom-nav-item-text) border-(--bottom-nav-border) pb-[env(safe-area-inset-bottom)] md:hidden',
        className,
      )}
      role='navigation'
      {...rest}
      ref={forwardedRef}
    />
  );
});

BottomNav.displayName = 'BottomNav';

export { BottomNav };
export type { BottomNavProps };
