
import * as React from 'react';


import { MenuItem } from './menu-item';
import { useMenuRadioGroupContext } from './menu-radio-context';

import type { ScopedProps } from './menu-context';
import type { MenuItemProps } from './menu-item';

const MENU_RADIO_ITEM_NAME = 'MenuRadioItem';

interface MenuRadioItemProps extends MenuItemProps {
  /** Identifies this item within its `MenuRadioGroup` — must be unique within the group. */
  value: string;
}

/**
 * `role="menuitemradio"` — composes `MenuItem` the same way
 * `MenuCheckboxItem` does. Selected state comes entirely from
 * `MenuRadioGroup`'s context (comparing this item's `value` against the
 * group's selected value), matching `RadioGroupItem`'s "no local state"
 * design.
 *
 * @example
 * ```tsx
 * <MenuRadioItem value="asc">Ascending</MenuRadioItem>
 * ```
 */
const MenuRadioItem = React.forwardRef<HTMLDivElement, ScopedProps<MenuRadioItemProps>>(
  (props, forwardedRef) => {
    const { value, onSelect, ...itemProps } = props;
    const context = useMenuRadioGroupContext(MENU_RADIO_ITEM_NAME);
    const isChecked = context.value === value;

    return (
      <MenuItem
        role="menuitemradio"
        aria-checked={isChecked}
        data-state={isChecked ? 'checked' : 'unchecked'}
        onSelect={(event) => {
          context.onValueChange(value);
          onSelect?.(event);
        }}
        {...itemProps}
        ref={forwardedRef}
      />
    );
  },
);

MenuRadioItem.displayName = MENU_RADIO_ITEM_NAME;

export { MenuRadioItem };
export type { MenuRadioItemProps };
