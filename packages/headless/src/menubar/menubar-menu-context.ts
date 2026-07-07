import * as React from 'react';

interface MenubarMenuContextValue {
  /** This `MenubarMenu`'s own identifying value, so its `MenubarTrigger` can tell `Menubar` which menu to activate. */
  value: string;
}

/**
 * Plain (non-scoped) context — unlike `Menubar`'s own context, a
 * `MenubarMenu` never nests inside another `MenubarMenu` (they're always
 * siblings under one `Menubar`), so there's no multi-instance-composition
 * risk `createContextScope` exists to solve here. Same reasoning as
 * `Avatar`'s image-loading-status context.
 */
const MenubarMenuContext = React.createContext<MenubarMenuContextValue | undefined>(undefined);

function useMenubarMenuContext(consumerName: string): MenubarMenuContextValue {
  const context = React.useContext(MenubarMenuContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`MenubarMenu\``);
  }
  return context;
}

export { MenubarMenuContext, useMenubarMenuContext };
export type { MenubarMenuContextValue };
