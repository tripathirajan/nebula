
import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { PopperAnchor } from '@nebula/primitives/popper';
import { Primitive } from '@nebula/primitives/primitive';
import { FocusItem } from '@nebula/primitives/roving-focus-group';
import * as React from 'react';


import { useMenuContext, usePopperScope } from '../menu/menu-context';

import { useMenubarContext } from './menubar-context';
import { useMenubarMenuContext } from './menubar-menu-context';

import type { ScopedProps } from './menubar-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const MENUBAR_TRIGGER_NAME = 'MenubarTrigger';

type MenubarTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * One menu's trigger button within a `Menubar`. Behaves like `MenuTrigger`
 * (click toggles this menu; `ArrowDown`/`ArrowUp` open it and focus the
 * first item — reads the enclosing `MenubarMenu`'s `Menu` context directly,
 * unscoped, same as `MenuTrigger` itself does), plus two menubar-specific
 * behaviors layered on top via `@nebula/primitives`' `FocusItem`:
 *
 * - Registers into `Menubar`'s `RovingFocusGroup` (also unscoped — see
 *   `menubar.tsx`) so Left/Right arrow keys move focus between sibling
 *   triggers.
 * - Once *some* menu in the menubar is already open, moving focus to this
 *   trigger — by pointer hover (which focuses it, mirroring `MenuItem`'s
 *   own pointer-move-focuses pattern) or by arrowing over from a sibling —
 *   switches the open menu to this one, without a click. Hovering an
 *   entirely closed menubar never opens anything, so incidental mouse
 *   travel across the bar doesn't pop menus open uninvited; the switch
 *   only kicks in once the user has already opened one deliberately.
 *
 * @example
 * ```tsx
 * <MenubarTrigger>File</MenubarTrigger>
 * ```
 */
const MenubarTrigger = React.forwardRef<HTMLButtonElement, ScopedProps<MenubarTriggerProps>>(
  (props, forwardedRef) => {
    const { __scopeMenubar, onClick, onKeyDown, onPointerEnter, onFocus, ...triggerProps } = props;
    // Unscoped: each `MenubarMenu` mints its own plain `<Menu>`, so the
    // nearest `MenuProvider` above this trigger is always the right one —
    // see `menubar-menu.tsx`'s header comment.
    const menuContext = useMenuContext(MENUBAR_TRIGGER_NAME, undefined);
    const popperScope = usePopperScope(undefined);
    const menubarContext = useMenubarContext(MENUBAR_TRIGGER_NAME, __scopeMenubar);
    const { value } = useMenubarMenuContext(MENUBAR_TRIGGER_NAME);

    return (
      <FocusItem asChild>
        <PopperAnchor asChild {...popperScope}>
          <Primitive
            as="button"
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={menuContext.open}
            aria-controls={menuContext.open ? menuContext.contentId : undefined}
            data-state={menuContext.open ? 'open' : 'closed'}
            {...triggerProps}
            ref={forwardedRef}
            onClick={composeEventHandlers(onClick, () =>
              menuContext.onOpenChange(!menuContext.open),
            )}
            onKeyDown={composeEventHandlers(onKeyDown, (event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                menuContext.onOpenChange(true);
              }
            })}
            onPointerEnter={composeEventHandlers(onPointerEnter, (event) => {
              event.currentTarget.focus();
            })}
            onFocus={composeEventHandlers(onFocus, () => {
              if (menubarContext.value !== undefined && menubarContext.value !== value) {
                menubarContext.onValueChange(value);
              }
            })}
          />
        </PopperAnchor>
      </FocusItem>
    );
  },
);

MenubarTrigger.displayName = MENUBAR_TRIGGER_NAME;

export { MenubarTrigger };
export type { MenubarTriggerProps };
