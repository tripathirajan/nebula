
import { useControllableState, useId } from '@nebula-lab/hooks';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { TabsProvider } from './tabs-context';

import type { ActivationMode, Orientation, ScopedProps } from './tabs-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface TabsProps extends PrimitivePropsWithRef<'div'> {
  /** Controlled: the currently selected tab's value. */
  value?: string;
  /** Uncontrolled: the initially selected tab's value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @default 'horizontal' */
  orientation?: Orientation;
  /**
   * `'automatic'` selects a tab as soon as it receives focus (arrow-key
   * navigation moves selection); `'manual'` requires Enter/Space to select
   * the focused tab. Both are valid per the WAI-ARIA Tabs pattern.
   * @default 'automatic'
   */
  activationMode?: ActivationMode;
}

/**
 * Root of the Tabs compound component — provides shared state to `TabList`,
 * `Tab`, and `TabPanel` via scoped context, following the WAI-ARIA Tabs
 * Authoring Practice. Renders a plain `div`; `TabList` is where
 * `role="tablist"` lives.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="account">
 *   <TabList>
 *     <Tab value="account">Account</Tab>
 *     <Tab value="password">Password</Tab>
 *   </TabList>
 *   <TabPanel value="account">Account settings...</TabPanel>
 *   <TabPanel value="password">Password settings...</TabPanel>
 * </Tabs>
 * ```
 */
const Tabs = React.forwardRef<HTMLDivElement, ScopedProps<TabsProps>>((props, forwardedRef) => {
  const {
    __scopeTabs,
    value: valueProp,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    activationMode = 'automatic',
    ...tabsProps
  } = props;

  const baseId = useId('nebula-tabs');
  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <TabsProvider
      scope={__scopeTabs}
      baseId={baseId}
      value={value}
      onValueChange={setValue}
      orientation={orientation}
      activationMode={activationMode}
    >
      <Primitive as="div" data-orientation={orientation} {...tabsProps} ref={forwardedRef} />
    </TabsProvider>
  );
});

Tabs.displayName = 'Tabs';

export { Tabs };
export type { TabsProps };
