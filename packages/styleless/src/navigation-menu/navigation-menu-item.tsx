import { Popover } from '../popover/popover';

import { useNavigationMenuContext } from './navigation-menu-context';
import { NavigationMenuItemContext } from './navigation-menu-item-context';

import type { ScopedProps } from './navigation-menu-context';
import type * as React from 'react';

interface NavigationMenuItemProps {
  /** Identifies this item among its `NavigationMenuList` siblings — matched against `NavigationMenu`'s `value` to decide whether this one's content is open. Omit it for a plain link item with no dropdown content (see `NavigationMenuLink`). */
  value?: string;
  children?: React.ReactNode;
}

/**
 * One item within a `NavigationMenuList`. If it has a `NavigationMenuTrigger`
 * + `NavigationMenuContent` pair, mints an ordinary (unscoped) `Popover`
 * whose `open` state is derived from whether `NavigationMenu`'s `value`
 * matches this item's own `value` — the same technique `MenubarMenu` uses
 * with `Menu`. Items that are just a plain link (`NavigationMenuLink`, no
 * dropdown) can omit `value` entirely; the `Popover` is minted regardless
 * (harmless — nothing ever opens it) so `<li>` semantics stay simple.
 *
 * @example
 * ```tsx
 * <NavigationMenuItem value="products">
 *   <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 *   <NavigationMenuPortal>
 *     <NavigationMenuContent>...</NavigationMenuContent>
 *   </NavigationMenuPortal>
 * </NavigationMenuItem>
 * ```
 */
function NavigationMenuItem(props: ScopedProps<NavigationMenuItemProps>) {
  const { __scopeNavigationMenu, value = '', children } = props;
  const context = useNavigationMenuContext('NavigationMenuItem', __scopeNavigationMenu);

  const itemContextValue = { value };

  return (
    <NavigationMenuItemContext.Provider value={itemContextValue}>
      <li>
        <Popover
          open={value !== '' && context.value === value}
          onOpenChange={(open) => context.onValueChange(open ? value : undefined)}
        >
          {children}
        </Popover>
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

NavigationMenuItem.displayName = 'NavigationMenuItem';

export { NavigationMenuItem };
export type { NavigationMenuItemProps };
