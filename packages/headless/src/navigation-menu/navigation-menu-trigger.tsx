import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { PopperAnchor } from '@nebula/primitives/popper';
import { Primitive } from '@nebula/primitives/primitive';
import { FocusItem } from '@nebula/primitives/roving-focus-group';
import * as React from 'react';

import { usePopoverContext, usePopperScope } from '../popover/popover-context';

import { useNavigationMenuContext } from './navigation-menu-context';
import { useNavigationMenuItemContext } from './navigation-menu-item-context';

import type { ScopedProps } from './navigation-menu-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const NAVIGATION_MENU_TRIGGER_NAME = 'NavigationMenuTrigger';

type NavigationMenuTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * Opens this item's `NavigationMenuContent` on hover (after `openDelay`) —
 * or immediately, with no delay, if some other item's content in this same
 * `NavigationMenu` is already open (matching a very common mega-menu
 * expectation: once you're "in" the menu, moving across the bar shouldn't
 * feel laggy). Click toggles immediately. Reads the enclosing
 * `NavigationMenuItem`'s `Popover` context directly, unscoped, same as
 * `MenubarTrigger` reads its `Menu` context.
 *
 * @example
 * ```tsx
 * <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 * ```
 */
const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  ScopedProps<NavigationMenuTriggerProps>
>((props, forwardedRef) => {
  const {
    __scopeNavigationMenu,
    onClick,
    onPointerEnter,
    onPointerLeave,
    onKeyDown,
    ...triggerProps
  } = props;

  // Unscoped: each `NavigationMenuItem` mints its own plain `<Popover>`, so
  // the nearest `PopoverProvider` above this trigger is always the right one
  // — see `navigation-menu-item.tsx`'s header comment.
  const popoverContext = usePopoverContext(NAVIGATION_MENU_TRIGGER_NAME, undefined);
  const popperScope = usePopperScope(undefined);
  const rootContext = useNavigationMenuContext(NAVIGATION_MENU_TRIGGER_NAME, __scopeNavigationMenu);
  const { value } = useNavigationMenuItemContext(NAVIGATION_MENU_TRIGGER_NAME);

  const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelOpenTimer = React.useCallback(() => {
    if (openTimerRef.current !== undefined) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
  }, []);
  React.useEffect(() => cancelOpenTimer, [cancelOpenTimer]);

  return (
    <FocusItem asChild>
      <PopperAnchor asChild {...popperScope}>
        <Primitive
          as="button"
          type="button"
          aria-expanded={popoverContext.open}
          aria-controls={popoverContext.open ? popoverContext.contentId : undefined}
          data-state={popoverContext.open ? 'open' : 'closed'}
          {...triggerProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(onClick, () => {
            cancelOpenTimer();
            rootContext.cancelCloseTimer();
            rootContext.onValueChange(popoverContext.open ? undefined : value);
          })}
          onPointerEnter={composeEventHandlers(onPointerEnter, () => {
            rootContext.cancelCloseTimer();
            cancelOpenTimer();
            if (rootContext.value !== undefined) {
              rootContext.onValueChange(value);
            } else {
              openTimerRef.current = setTimeout(() => {
                rootContext.onValueChange(value);
              }, rootContext.openDelay);
            }
          })}
          onPointerLeave={composeEventHandlers(onPointerLeave, () => {
            cancelOpenTimer();
            rootContext.startCloseTimer();
          })}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (event.key === 'ArrowDown' && !popoverContext.open) {
              event.preventDefault();
              rootContext.cancelCloseTimer();
              rootContext.onValueChange(value);
            }
          })}
        />
      </PopperAnchor>
    </FocusItem>
  );
});

NavigationMenuTrigger.displayName = NAVIGATION_MENU_TRIGGER_NAME;

export { NavigationMenuTrigger };
export type { NavigationMenuTriggerProps };
