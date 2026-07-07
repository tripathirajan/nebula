import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { DismissibleLayer } from '@nebula/primitives/dismissible-layer';
import { FocusScope } from '@nebula/primitives/focus-scope';
import { PopperContent } from '@nebula/primitives/popper';
import { Presence } from '@nebula/primitives/presence';
import * as React from 'react';

import { usePopoverContext, usePopperScope } from '../popover/popover-context';

import { useNavigationMenuContext } from './navigation-menu-context';

import type { ScopedProps } from './navigation-menu-context';
import type { Align, PopperContentProps, Side } from '@nebula/primitives/popper';

const NAVIGATION_MENU_CONTENT_NAME = 'NavigationMenuContent';

interface NavigationMenuContentProps
  extends Pick<
    PopperContentProps,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'avoidCollisions' | 'collisionPadding'
  > {
  className?: string;
  children?: React.ReactNode;
  /** Keep mounted while closed instead of unmounting. @default false */
  forceMount?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
}

/**
 * `role="dialog"`, non-modal — same `Presence` > `DismissibleLayer` >
 * `FocusScope` > `PopperContent` collapsing `PopoverContent` uses.
 * Pointer-enter cancels the shared close timer (so moving the mouse from
 * the trigger down into the content doesn't close it mid-transit); pointer
 * leave re-arms it — the same pattern `NavigationMenuTrigger` uses, since
 * either one losing the pointer should (eventually) close the menu unless
 * it lands on the other.
 *
 * @example
 * ```tsx
 * <NavigationMenuContent>
 *   <a href="/products/a">Product A</a>
 *   <a href="/products/b">Product B</a>
 * </NavigationMenuContent>
 * ```
 */
const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  ScopedProps<NavigationMenuContentProps>
>((props, forwardedRef) => {
  const {
    __scopeNavigationMenu,
    forceMount = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onPointerEnter,
    onPointerLeave,
    side,
    sideOffset,
    align,
    alignOffset,
    avoidCollisions,
    collisionPadding,
    ...contentProps
  } = props;

  // Unscoped: reads the ambient `Popover` this item minted (see
  // `navigation-menu-item.tsx`), same as `NavigationMenuTrigger`.
  const popoverContext = usePopoverContext(NAVIGATION_MENU_CONTENT_NAME, undefined);
  const popperScope = usePopperScope(undefined);
  const rootContext = useNavigationMenuContext(NAVIGATION_MENU_CONTENT_NAME, __scopeNavigationMenu);

  return (
    <Presence present={forceMount || popoverContext.open}>
      <DismissibleLayer
        asChild
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={onPointerDownOutside}
        onDismiss={() => popoverContext.onOpenChange(false)}
      >
        <FocusScope asChild trapped={false}>
          <PopperContent
            {...popperScope}
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            avoidCollisions={avoidCollisions}
            collisionPadding={collisionPadding}
            role="dialog"
            id={popoverContext.contentId}
            data-state={popoverContext.open ? 'open' : 'closed'}
            {...contentProps}
            ref={forwardedRef}
            onPointerEnter={composeEventHandlers(onPointerEnter, () =>
              rootContext.cancelCloseTimer(),
            )}
            onPointerLeave={composeEventHandlers(onPointerLeave, () =>
              rootContext.startCloseTimer(),
            )}
          />
        </FocusScope>
      </DismissibleLayer>
    </Presence>
  );
});

NavigationMenuContent.displayName = NAVIGATION_MENU_CONTENT_NAME;

export { NavigationMenuContent };
export type { NavigationMenuContentProps, Side, Align };
