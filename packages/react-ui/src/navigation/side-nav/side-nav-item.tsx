import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { Slottable } from '@nebula-lab/primitives/slot';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface SideNavItemOwnProps {
  /** Icon rendered left of the label — treated as decorative (`aria-hidden`), same convention `BottomNavItem`'s `icon` prop uses; the accessible name comes from `label`. */
  icon: React.ReactNode;
  /** Visible label rendered right of the icon, and also this item's accessible name. */
  label: string;
  /** Marks this item as the current page — sets `aria-current="page"` and `data-state="active"` for styling, same convention `BottomNavItem` uses. @default false */
  active?: boolean;
  /**
   * Shrinks to an icon-only square (matching `Sidebar`'s own `collapsed`
   * width) — `label` still renders for the accessible name, visually hidden
   * via `sr-only` rather than unmounted, so a screen reader and `Tooltip`
   * (a consumer should pair one on top when collapsing, since the visible
   * label disappears) both still have real text to read. Threaded down
   * explicitly by the consumer, the same "no context, plain prop" shape
   * `Sidebar`'s own doc comment recommends — not read off a DOM ancestor.
   * @default false
   */
  collapsed?: boolean;
}

type SideNavItemProps = PrimitivePropsWithRef<'a'> & SideNavItemOwnProps;

/**
 * One sidebar nav destination — renders as an `<a>` by default; `asChild` it
 * onto a router `Link` the same way `BottomNavItem`/`Button` support
 * wrapping a real anchor, e.g. `<SideNavItem asChild><Link to="/">...`.
 *
 * The active state reads `--side-nav-item-active-text` (an alias for
 * `--color-primary-text`, the theme-adjusted variant of `primary` — not the
 * raw `--color-primary` fill, which fails WCAG 1.4.3 as text in dark mode,
 * 3.44:1 against `base-100`; see `tokens/component.ts`'s `sideNavTokens` doc
 * comment) alongside a soft `color-mix` tint background, not a solid fill —
 * the same "ghost button" affordance `buttonVariants`' `ghost` variant uses
 * (colored text on a light colored tint), including its hover behavior:
 * an *inactive* item hovers to the plain neutral `base-200` fill, but an
 * *active* item hovers to a deeper version of its own colored tint (12% ->
 * 20%, same jump `ghost` buttons make) rather than the neutral fill fighting
 * the active color.
 *
 * @example
 * ```tsx
 * <SideNavItem icon={<HomeIcon />} label="Home" active href="/" />
 * <SideNavItem icon={<SearchIcon />} label="Search" asChild>
 *   <Link to="/search" />
 * </SideNavItem>
 * ```
 */
const SideNavItem = React.forwardRef<HTMLAnchorElement, SideNavItemProps>((props, forwardedRef) => {
  const { className, icon, label, active = false, collapsed = false, children, ...rest } = props;
  return (
    <Primitive
      as="a"
      aria-current={active ? 'page' : undefined}
      data-state={active ? 'active' : 'inactive'}
      className={cn(
        'flex items-center gap-3 rounded-[var(--radius-selector)] px-3 py-2 text-sm font-medium text-[var(--side-nav-item-text)] transition-colors data-[state=inactive]:hover:bg-[var(--side-nav-item-hover-bg)] data-[state=active]:bg-[var(--side-nav-item-active-bg)] data-[state=active]:text-[var(--side-nav-item-active-text)] data-[state=active]:hover:bg-[var(--side-nav-item-active-hover-bg)]',
        collapsed && 'justify-center px-2',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    >
      <Slottable>{children}</Slottable>
      <span aria-hidden="true" className="h-5 w-5 shrink-0">
        {icon}
      </span>
      <span className={cn(collapsed && 'sr-only')}>{label}</span>
    </Primitive>
  );
});

SideNavItem.displayName = 'SideNavItem';

export { SideNavItem };
export type { SideNavItemProps };
