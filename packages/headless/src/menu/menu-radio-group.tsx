
import { useControllableState } from '@nebula/hooks';
import * as React from 'react';


import { MenuRadioGroupContext } from './menu-radio-context';

import type { ScopedProps } from './menu-context';

const MENU_RADIO_GROUP_NAME = 'MenuRadioGroup';

interface MenuRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

/**
 * Groups `MenuRadioItem`s into a single-select set (`role="group"`, no
 * additional ARIA role of its own beyond that — the individual items carry
 * `role="menuitemradio"`). Same controlled/uncontrolled `value`/
 * `defaultValue`/`onValueChange` shape as `RadioGroup`, via a plain
 * `React.createContext` (see `menu-radio-context.ts` for why) rather than
 * `createContextScope` — it only ever nests inside the one `Menu` that
 * rendered it.
 *
 * @example
 * ```tsx
 * <MenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
 *   <MenuRadioItem value="asc">Ascending</MenuRadioItem>
 *   <MenuRadioItem value="desc">Descending</MenuRadioItem>
 * </MenuRadioGroup>
 * ```
 */
function MenuRadioGroup(props: ScopedProps<MenuRadioGroupProps>) {
  const { value: valueProp, defaultValue, onValueChange, children } = props;

  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const contextValue = React.useMemo(
    () => ({ value, onValueChange: setValue }),
    [value, setValue],
  );

  return (
    <div role="group">
      <MenuRadioGroupContext.Provider value={contextValue}>{children}</MenuRadioGroupContext.Provider>
    </div>
  );
}

MenuRadioGroup.displayName = MENU_RADIO_GROUP_NAME;

export { MenuRadioGroup };
export type { MenuRadioGroupProps };
