import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface BottomNavItemOwnProps {
  /** Icon rendered above the label — treated as decorative (`aria-hidden`), same convention `CardHeader`'s `icon` prop uses; the accessible name comes from `label`. */
  icon: React.ReactNode;
  /** Visible label rendered below the icon, and also this item's accessible name. */
  label: string;
  /** Marks this item as the current page — sets `aria-current="page"` (mirrors `PaginationLink`'s convention) and `data-state="active"` for styling. @default false */
  active?: boolean;
}

type BottomNavItemProps = PrimitivePropsWithRef<'a'> & BottomNavItemOwnProps;

/**
 * One tab-bar destination — renders as an `<a>` by default; `asChild` it
 * onto a router `Link` the same way `Button`/`PaginationLink` support
 * wrapping a real anchor, e.g. `<BottomNavItem asChild><Link to="/">...`.
 * `aria-current="page"` on the active item follows the same WAI-ARIA
 * convention `PaginationLink` already uses in this package (see
 * `../pagination/pagination-link.tsx`'s headless counterpart).
 *
 * @example
 * ```tsx
 * <BottomNavItem icon={<HomeIcon />} label="Home" active href="/" />
 * <BottomNavItem icon={<SearchIcon />} label="Search" asChild>
 *   <Link to="/search">Search</Link>
 * </BottomNavItem>
 * ```
 */
const BottomNavItem = React.forwardRef<HTMLAnchorElement, BottomNavItemProps>(
  (props, forwardedRef) => {
    const { className, icon, label, active = false, ...rest } = props;
    return (
      <Primitive
        as="a"
        aria-current={active ? 'page' : undefined}
        data-state={active ? 'active' : 'inactive'}
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-[var(--bottom-nav-item-text)] transition-colors data-[state=active]:text-[var(--bottom-nav-item-active-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        <span aria-hidden="true" className="h-5 w-5">
          {icon}
        </span>
        <span>{label}</span>
      </Primitive>
    );
  },
);

BottomNavItem.displayName = 'BottomNavItem';

export { BottomNavItem };
export type { BottomNavItemProps };
