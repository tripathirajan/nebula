import { useControllableState } from '@nebula-lab/hooks';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { NavigationMenuProvider } from './navigation-menu-context';

import type { ScopedProps } from './navigation-menu-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface NavigationMenuProps extends PrimitivePropsWithRef<'nav'> {
  /** Controlled: which `NavigationMenuItem`'s `value` currently has its content open. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** @default 200 */
  openDelay?: number;
  /** @default 300 */
  closeDelay?: number;
}

/**
 * Root of the NavigationMenu compound component — a `<nav>` wrapping
 * `NavigationMenuList`/`NavigationMenuItem`s. Each `NavigationMenuItem`
 * mints its own ordinary `Popover` for its trigger/content pair (see
 * `navigation-menu-item.tsx`), the same "one shared primitive instance per
 * repeated part" technique `MenubarMenu` uses with `Menu` — this root only
 * needs to track *which* item is open (`value`) and own the shared
 * hover-intent close timer both `NavigationMenuTrigger` and
 * `NavigationMenuContent` arm/disarm.
 *
 * Unlike `Popover`/`Dialog`, opening is hover-driven (`openDelay`), matching
 * the site-header mega-menu convention this component targets — deliberately
 * simplified vs. Radix's `NavigationMenu`: no shared `Viewport` (the
 * animated width/height crossfade between different items' content) and no
 * `NavigationMenuIndicator` (the little arrow/underline that tracks the open
 * trigger) — both are visual polish layered on top of the same open/close
 * state this already exposes, not core behavior, and can be built by a
 * consumer directly off `data-state`/`aria-expanded` if wanted.
 *
 * @example
 * ```tsx
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem value="products">
 *       <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 *       <NavigationMenuPortal>
 *         <NavigationMenuContent>...mega menu...</NavigationMenuContent>
 *       </NavigationMenuPortal>
 *     </NavigationMenuItem>
 *     <NavigationMenuItem value="docs">
 *       <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
 *     </NavigationMenuItem>
 *   </NavigationMenuList>
 * </NavigationMenu>
 * ```
 */
const NavigationMenu = React.forwardRef<HTMLElement, ScopedProps<NavigationMenuProps>>(
  (props, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      defaultValue,
      onValueChange,
      openDelay = 200,
      closeDelay = 300,
      ...navProps
    } = props;

    const [value, setValue] = useControllableState<string | undefined>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const cancelCloseTimer = React.useCallback(() => {
      if (closeTimerRef.current !== undefined) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = undefined;
      }
    }, []);

    const startCloseTimer = React.useCallback(() => {
      cancelCloseTimer();
      closeTimerRef.current = setTimeout(() => setValue(undefined), closeDelay);
    }, [cancelCloseTimer, closeDelay, setValue]);

    React.useEffect(() => cancelCloseTimer, [cancelCloseTimer]);

    return (
      <NavigationMenuProvider
        scope={__scopeNavigationMenu}
        value={value}
        onValueChange={setValue}
        openDelay={openDelay}
        closeDelay={closeDelay}
        startCloseTimer={startCloseTimer}
        cancelCloseTimer={cancelCloseTimer}
      >
        <Primitive as="nav" {...navProps} ref={forwardedRef} />
      </NavigationMenuProvider>
    );
  },
);

NavigationMenu.displayName = 'NavigationMenu';

export { NavigationMenu };
export type { NavigationMenuProps };
