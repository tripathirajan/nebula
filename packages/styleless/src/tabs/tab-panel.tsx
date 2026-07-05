
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import { makeContentId, makeTriggerId, useTabsContext } from './tabs-context';

import type { ScopedProps } from './tabs-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const TAB_PANEL_NAME = 'TabPanel';

interface TabPanelProps extends PrimitivePropsWithRef<'div'> {
  /** Must match the `value` of the `Tab` that controls this panel. */
  value: string;
  /**
   * Keep the panel mounted (but `hidden`) while inactive instead of
   * unmounting it — useful to preserve panel-local state (form input, video
   * playback position, ...) across tab switches.
   * @default false
   */
  forceMount?: boolean;
}

/**
 * `role="tabpanel"`. Unmounts when inactive unless `forceMount` is set.
 *
 * @example
 * ```tsx
 * <TabPanel value="password" forceMount>
 *   <PasswordForm />
 * </TabPanel>
 * ```
 */
const TabPanel = React.forwardRef<HTMLDivElement, ScopedProps<TabPanelProps>>(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount = false, ...panelProps } = props;
    const context = useTabsContext(TAB_PANEL_NAME, __scopeTabs);
    const isSelected = context.value === value;

    if (!isSelected && !forceMount) return null;

    return (
      <Primitive
        as="div"
        role="tabpanel"
        id={makeContentId(context.baseId, value)}
        aria-labelledby={makeTriggerId(context.baseId, value)}
        data-state={isSelected ? 'active' : 'inactive'}
        data-orientation={context.orientation}
        hidden={!isSelected}
        tabIndex={0}
        {...panelProps}
        ref={forwardedRef}
      />
    );
  },
);

TabPanel.displayName = TAB_PANEL_NAME;

export { TabPanel };
export type { TabPanelProps };
