import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type SideNavProps = PrimitivePropsWithRef<'nav'>;

/**
 * The vertical nav landmark meant to render inside `Sidebar`'s children —
 * `Sidebar` itself is a bare `<aside>` with no opinion on content (see its
 * own doc comment), so `SideNav` is the `<nav>` landmark + vertical-stack
 * layout that content actually needs.
 *
 * Composes `SideNavItem`/`SideNavGroup` the same way `BottomNav` composes
 * `BottomNavItem` — no shared context or centrally-tracked active state.
 * `SideNavItem`'s `active` and both components' `collapsed` are plain props
 * the consumer already holds (from their router, and the same `collapsed`
 * boolean passed to the surrounding `Sidebar`), per `Sidebar`'s own doc
 * comment on how a consumer should thread that state into its children.
 *
 * @example
 * ```tsx
 * <Sidebar collapsed={collapsed}>
 *   <SideNav>
 *     <SideNavItem icon={<HomeIcon />} label="Home" active collapsed={collapsed} href="/" />
 *     <SideNavGroup label="Settings" collapsed={collapsed}>
 *       <SideNavItem icon={<UserIcon />} label="Profile" collapsed={collapsed} href="/settings/profile" />
 *     </SideNavGroup>
 *   </SideNav>
 * </Sidebar>
 * ```
 */
const SideNav = React.forwardRef<HTMLElement, SideNavProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="nav"
      className={cn('flex flex-col gap-1', className)}
      role="navigation"
      {...rest}
      ref={forwardedRef}
    />
  );
});

SideNav.displayName = 'SideNav';

export { SideNav };
export type { SideNavProps };
