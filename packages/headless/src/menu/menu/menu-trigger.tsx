
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { PopperAnchor } from '@nebula-lab/primitives/popper';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useMenuContext, usePopperScope } from './menu-context';

import type { ScopedProps } from './menu-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const MENU_TRIGGER_NAME = 'MenuTrigger';

type MenuTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * Toggles the menu open/closed on click; `ArrowDown`/`ArrowUp` open it too
 * (both focus the first item on open — see `menu.tsx`'s header comment on
 * why `ArrowUp` doesn't focus the last item here). Also doubles as
 * `PopperAnchor` (via `asChild`), same as `PopoverTrigger`/`TooltipTrigger`.
 *
 * @example
 * ```tsx
 * <MenuTrigger>Options</MenuTrigger>
 * ```
 */
const MenuTrigger = React.forwardRef<HTMLButtonElement, ScopedProps<MenuTriggerProps>>(
  (props, forwardedRef) => {
    const { __scopeMenu, onClick, onKeyDown, ...triggerProps } = props;
    const context = useMenuContext(MENU_TRIGGER_NAME, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);

    return (
      <PopperAnchor asChild {...popperScope}>
        <Primitive
          as="button"
          type="button"
          aria-haspopup="menu"
          aria-expanded={context.open}
          aria-controls={context.open ? context.contentId : undefined}
          data-state={context.open ? 'open' : 'closed'}
          {...triggerProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(onClick, () => context.onOpenChange(!context.open))}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              context.onOpenChange(true);
            }
          })}
        />
      </PopperAnchor>
    );
  },
);

MenuTrigger.displayName = MENU_TRIGGER_NAME;

export { MenuTrigger };
export type { MenuTriggerProps };
