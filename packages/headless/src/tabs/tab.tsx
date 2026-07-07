
import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import { makeContentId, makeTriggerId, useTabsContext } from './tabs-context';

import type { ScopedProps } from './tabs-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const TAB_NAME = 'Tab';

interface TabProps extends PrimitivePropsWithRef<'button'> {
  /** Identifies this tab and the `TabPanel` it controls — must be unique within the `Tabs`. */
  value: string;
  disabled?: boolean;
}

/**
 * `role="tab"`. Selected state and keyboard focusability (`tabIndex`) are
 * derived entirely from context — there's no local state here, so a `Tab`
 * rendered outside its `TabList`'s DOM order still behaves correctly.
 *
 * @example
 * ```tsx
 * <Tab value="password" disabled={!hasAccount}>
 *   Password
 * </Tab>
 * ```
 */
const Tab = React.forwardRef<HTMLButtonElement, ScopedProps<TabProps>>((props, forwardedRef) => {
  const { __scopeTabs, value, disabled = false, onClick, onFocus, ...tabProps } = props;
  const context = useTabsContext(TAB_NAME, __scopeTabs);
  const isSelected = context.value === value;

  const selectSelf = () => context.onValueChange(value);

  return (
    <Primitive
      as="button"
      type="button"
      role="tab"
      id={makeTriggerId(context.baseId, value)}
      aria-selected={isSelected}
      aria-controls={makeContentId(context.baseId, value)}
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={context.orientation}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      tabIndex={isSelected ? 0 : -1}
      {...tabProps}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) selectSelf();
      })}
      onFocus={composeEventHandlers(onFocus, () => {
        // Automatic activation mode: TabList already moved DOM focus here on
        // arrow-key press, so selecting on focus covers both mouse and
        // keyboard without duplicating the "click" side effect.
        if (!disabled && context.activationMode === 'automatic') selectSelf();
      })}
    />
  );
});

Tab.displayName = TAB_NAME;

export { Tab };
export type { TabProps };
