
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { FocusItem } from '@nebula-lab/primitives/roving-focus-group';
import * as React from 'react';


import { useMenuContext } from './menu-context';

import type { ScopedProps } from './menu-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const MENU_ITEM_NAME = 'MenuItem';

interface MenuItemProps extends Omit<PrimitivePropsWithRef<'div'>, 'onSelect'> {
  disabled?: boolean;
  /**
   * Called on activation (click, or Enter/Space while focused). Call
   * `event.preventDefault()` to stop the menu from closing afterward — the
   * default is to close, matching a native menu selecting an action.
   *
   * Named (and shaped, taking a plain `Event`) after the DOM's own
   * `onSelect` in spirit, but deliberately not that literal prop — a native
   * `<div>`'s `onSelect` fires on text-selection changes, an unrelated
   * concept this component has no use for, so it's omitted from the base
   * props and replaced with this one.
   */
  onSelect?: (event: Event) => void;
}

/**
 * `role="menuitem"`. Wrapped in `@nebula-lab/primitives`' `FocusItem` for the
 * roving-tabindex + arrow-key/Home/End behavior `MenuContent`'s
 * `RovingFocusGroup` provides — selecting via click, Enter, and Space all
 * call the same `select()`. Moving the pointer over an item also focuses
 * it, so mouse and keyboard users get the same "current item" highlight
 * (`:focus`-based styling in `react-ui`, not a separate hover state).
 *
 * @example
 * ```tsx
 * <MenuItem onSelect={() => save()}>Save</MenuItem>
 * <MenuItem onSelect={() => remove()} disabled>Delete</MenuItem>
 * ```
 */
const MenuItem = React.forwardRef<HTMLDivElement, ScopedProps<MenuItemProps>>(
  (props, forwardedRef) => {
    const {
      __scopeMenu,
      disabled = false,
      onSelect,
      onClick,
      onKeyDown,
      onPointerMove,
      ...itemProps
    } = props;
    const context = useMenuContext(MENU_ITEM_NAME, __scopeMenu);

    const select = () => {
      if (disabled) return;
      const selectEvent = new Event('menuItemSelect', { cancelable: true, bubbles: false });
      onSelect?.(selectEvent);
      if (!selectEvent.defaultPrevented) context.onOpenChange(false);
    };

    return (
      <FocusItem asChild focusable={!disabled}>
        <Primitive
          as="div"
          role="menuitem"
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? '' : undefined}
          {...itemProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(onClick, select)}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (disabled) return;
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              select();
            }
          })}
          onPointerMove={composeEventHandlers(onPointerMove, (event) => {
            if (!disabled) event.currentTarget.focus();
          })}
        />
      </FocusItem>
    );
  },
);

MenuItem.displayName = MENU_ITEM_NAME;

export { MenuItem };
export type { MenuItemProps };
