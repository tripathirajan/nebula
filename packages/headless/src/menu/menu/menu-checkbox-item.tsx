
import * as React from 'react';


import { MenuItem } from './menu-item';

import type { ScopedProps } from './menu-context';
import type { MenuItemProps } from './menu-item';

const MENU_CHECKBOX_ITEM_NAME = 'MenuCheckboxItem';

interface MenuCheckboxItemProps extends MenuItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * `role="menuitemcheckbox"` — a `MenuItem` that also toggles a boolean on
 * selection. Composes `MenuItem` directly (passing `role`/`aria-checked`/
 * `data-state` through the same prop object, with `MenuItem`'s own
 * hardcoded `role="menuitem"` overridden by this component's explicit
 * `role` prop landing later in the spread) rather than reimplementing
 * selection/keyboard handling a second time.
 *
 * @example
 * ```tsx
 * const [wrap, setWrap] = useState(true);
 * <MenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>Word wrap</MenuCheckboxItem>
 * ```
 */
const MenuCheckboxItem = React.forwardRef<HTMLDivElement, ScopedProps<MenuCheckboxItemProps>>(
  (props, forwardedRef) => {
    const { checked = false, onCheckedChange, onSelect, ...itemProps } = props;

    return (
      <MenuItem
        role="menuitemcheckbox"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        onSelect={(event) => {
          onCheckedChange?.(!checked);
          onSelect?.(event);
        }}
        {...itemProps}
        ref={forwardedRef}
      />
    );
  },
);

MenuCheckboxItem.displayName = MENU_CHECKBOX_ITEM_NAME;

export { MenuCheckboxItem };
export type { MenuCheckboxItemProps };
