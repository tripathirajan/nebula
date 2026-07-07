
import * as React from 'react';


import { Menu } from '../menu/menu';

import { useMenubarContext } from './menubar-context';
import { MenubarMenuContext } from './menubar-menu-context';

import type { ScopedProps } from './menubar-context';

interface MenubarMenuProps {
  /** Identifies this menu among its `Menubar` siblings — matched against `Menubar`'s `value` to decide whether this one is open. */
  value: string;
  children?: React.ReactNode;
}

/**
 * One menu within a `Menubar` — mints an ordinary (unscoped) `Menu` whose
 * `open` state is derived from whether `Menubar`'s `value` matches this
 * menu's own `value`, rather than managing its own independent open state.
 * Siblings under one `Menubar` are never nested inside each other, so a
 * plain, unscoped `<Menu>` per `MenubarMenu` is safe (each gets its own
 * context via ordinary React provider nesting) — see `menubar-context.ts`'s
 * header comment for why `Menubar` itself doesn't compose `Menu`'s scope.
 *
 * `MenubarTrigger`/`MenubarContent`/etc. underneath read this `Menu`'s
 * context exactly like `MenuTrigger`/`MenuContent` do; only `MenubarTrigger`
 * needs to additionally know its own `value` (via `MenubarMenuContext`) to
 * tell `Menubar` which menu to activate.
 */
function MenubarMenu(props: ScopedProps<MenubarMenuProps>) {
  const { __scopeMenubar, value, children } = props;
  const context = useMenubarContext('MenubarMenu', __scopeMenubar);

  const menuContextValue = React.useMemo(() => ({ value }), [value]);

  return (
    <MenubarMenuContext.Provider value={menuContextValue}>
      <Menu
        open={context.value === value}
        onOpenChange={(open) => context.onValueChange(open ? value : undefined)}
      >
        {children}
      </Menu>
    </MenubarMenuContext.Provider>
  );
}

MenubarMenu.displayName = 'MenubarMenu';

export { MenubarMenu };
export type { MenubarMenuProps };
