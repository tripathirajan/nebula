import * as React from 'react';

interface MenuRadioGroupContextValue {
  value?: string;
  onValueChange: (value: string) => void;
}

/**
 * Plain, non-scoped `React.createContext` (same pattern as `Avatar`'s
 * image-loading-status context) rather than `createContextScope` — a
 * `MenuRadioGroup` only ever nests inside the one `Menu`/`MenuContent`
 * that rendered it, there's no multi-instance-composition case to guard
 * against the way `Menu`'s own context (composed with `Popper`'s) does.
 */
const MenuRadioGroupContext = React.createContext<MenuRadioGroupContextValue | null>(null);

function useMenuRadioGroupContext(consumerName: string): MenuRadioGroupContextValue {
  const context = React.useContext(MenuRadioGroupContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within a \`MenuRadioGroup\`.`);
  }
  return context;
}

export { MenuRadioGroupContext, useMenuRadioGroupContext };
export type { MenuRadioGroupContextValue };
