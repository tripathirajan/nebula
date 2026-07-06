import * as React from 'react';

interface NavigationMenuItemContextValue {
  /** This `NavigationMenuItem`'s own identifying value, so its `NavigationMenuTrigger` can tell `NavigationMenu` which item to activate. */
  value: string;
}

/**
 * Plain (non-scoped) context — a `NavigationMenuItem` never nests inside
 * another `NavigationMenuItem` (they're always siblings under one
 * `NavigationMenuList`), so there's no multi-instance-composition risk
 * `createContextScope` exists to solve here. Same reasoning as
 * `MenubarMenuContext`.
 */
const NavigationMenuItemContext = React.createContext<NavigationMenuItemContextValue | undefined>(
  undefined,
);

function useNavigationMenuItemContext(consumerName: string): NavigationMenuItemContextValue {
  const context = React.useContext(NavigationMenuItemContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`NavigationMenuItem\``);
  }
  return context;
}

export { NavigationMenuItemContext, useNavigationMenuItemContext };
export type { NavigationMenuItemContextValue };
