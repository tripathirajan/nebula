import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { Slottable } from '@nebula-lab/primitives/slot';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

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
 * `icon`/`label` are always what render as this item's visible content, in
 * both modes — they're wrapped in `Slottable` (see
 * `@nebula-lab/primitives/slot`) so `asChild`'s `Slot` can find the real
 * slotted child (the `Link`) buried inside them rather than seeing two bare
 * `<span>`s as its "child" and refusing to render at all (`Slot` requires
 * exactly one; two `<span>`s isn't a usage error on the consumer's part, it
 * was this component unconditionally rendering both regardless of
 * `asChild`, which crashed with no useful error — the previous version of
 * this file did exactly that). The child passed to `asChild` should have no
 * children of its own (`<Link to="/search" />`, not `<Link to="/search">
 * Search</Link>`) — `Slottable` appends `icon`/`label` after whatever
 * children the slotted child already has, so a non-empty child renders its
 * own content *in addition to*, not instead of, `label`.
 *
 * Active state uses the same "ghost button" tinted-background pattern
 * `SideNavItem` uses (a low-opacity `primary` tint at rest, deepening on
 * hover) rather than only changing text color — the two nav components now
 * read as the same "current page" affordance instead of diverging.
 *
 * @example
 * ```tsx
 * <BottomNavItem icon={<HomeIcon />} label="Home" active href="/" />
 * <BottomNavItem icon={<SearchIcon />} label="Search" asChild>
 *   <Link to="/search" />
 * </BottomNavItem>
 * ```
 */
const BottomNavItem = React.forwardRef<HTMLAnchorElement, BottomNavItemProps>(
  (props, forwardedRef) => {
    const { className, icon, label, active = false, children, ...rest } = props;
    return (
      <Primitive
        as="a"
        aria-current={active ? 'page' : undefined}
        data-state={active ? 'active' : 'inactive'}
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-[var(--bottom-nav-item-text)] transition-colors data-[state=inactive]:hover:bg-[var(--bottom-nav-item-hover-bg)] data-[state=active]:bg-[var(--bottom-nav-item-active-bg)] data-[state=active]:text-[var(--bottom-nav-item-active-text)] data-[state=active]:hover:bg-[var(--bottom-nav-item-active-hover-bg)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        <Slottable>{children}</Slottable>
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
