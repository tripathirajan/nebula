
import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { DismissibleLayer } from '@nebula/primitives/dismissible-layer';
import { FocusScope } from '@nebula/primitives/focus-scope';
import { PopperContent } from '@nebula/primitives/popper';
import { Presence } from '@nebula/primitives/presence';
import { RovingFocusGroup } from '@nebula/primitives/roving-focus-group';
import * as React from 'react';


import { useMenuContext, usePopperScope } from './menu-context';

import type { ScopedProps } from './menu-context';
import type { Align, PopperContentProps, Side } from '@nebula/primitives/popper';

const MENU_CONTENT_NAME = 'MenuContent';

interface MenuContentProps
  extends Pick<
    PopperContentProps,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'avoidCollisions' | 'collisionPadding'
  > {
  className?: string;
  children?: React.ReactNode;
  /** Keep mounted while closed instead of unmounting. @default false */
  forceMount?: boolean;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop Escape from closing the menu. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop an outside click from closing the menu. */
  onPointerDownOutside?: (event: PointerEvent) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

/**
 * `role="menu"`, positioned against `MenuTrigger`'s anchor via
 * `@nebula/primitives`' `PopperContent`. Composes the same
 * `Presence` > `DismissibleLayer` > `FocusScope` chain `PopoverContent`
 * does (non-modal: `trapped={false}`, focus moves in on open and restores
 * to the trigger on close) plus `RovingFocusGroup` for arrow-key/Home/End
 * navigation between `MenuItem`s — the WAI-ARIA Menu pattern's keyboard
 * model. `Tab` is handled directly here (not by `DismissibleLayer`, which
 * only covers Escape/outside-click): per the APG, `Tab` inside an open menu
 * closes it and lets focus continue moving through the page normally,
 * rather than being trapped.
 *
 * Defaults `align` to `'start'` (unlike `PopperContent`'s own `'center'`
 * default) — menus conventionally left-align with their trigger.
 *
 * @example
 * ```tsx
 * <MenuContent sideOffset={4}>
 *   <MenuItem onSelect={() => save()}>Save</MenuItem>
 * </MenuContent>
 * ```
 */
const MenuContent = React.forwardRef<HTMLDivElement, ScopedProps<MenuContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopeMenu,
      forceMount = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      side,
      sideOffset,
      align = 'start',
      alignOffset,
      avoidCollisions,
      collisionPadding,
      onKeyDown,
      ...contentProps
    } = props;
    const context = useMenuContext(MENU_CONTENT_NAME, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);

    const handleClose = () => context.onOpenChange(false);

    return (
      <Presence present={forceMount || context.open}>
        <DismissibleLayer
          asChild
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onDismiss={handleClose}
        >
          <FocusScope asChild trapped={false}>
            <RovingFocusGroup asChild orientation="vertical" loop>
              <PopperContent
                {...popperScope}
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                avoidCollisions={avoidCollisions}
                collisionPadding={collisionPadding}
                role="menu"
                id={context.contentId}
                data-state={context.open ? 'open' : 'closed'}
                {...contentProps}
                ref={forwardedRef}
                onKeyDown={composeEventHandlers(onKeyDown, (event) => {
                  if (event.key === 'Tab') handleClose();
                })}
              />
            </RovingFocusGroup>
          </FocusScope>
        </DismissibleLayer>
      </Presence>
    );
  },
);

MenuContent.displayName = MENU_CONTENT_NAME;

export { MenuContent };
export type { MenuContentProps, Side, Align };
