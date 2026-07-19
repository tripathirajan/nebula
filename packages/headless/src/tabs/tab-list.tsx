
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula-lab/primitives/compose-refs';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useTabsContext } from './tabs-context';

import type { ScopedProps } from './tabs-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const TAB_LIST_NAME = 'TabList';

type TabListProps = PrimitivePropsWithRef<'div'>;

/**
 * `role="tablist"` — owns arrow-key roving-tabindex navigation between
 * `Tab`s (Left/Right for horizontal, Up/Down for vertical, Home/End to jump
 * to the first/last tab), per the WAI-ARIA Tabs pattern.
 *
 * @example
 * ```tsx
 * <TabList>
 *   <Tab value="account">Account</Tab>
 *   <Tab value="password">Password</Tab>
 * </TabList>
 * ```
 */
const TabList = React.forwardRef<HTMLDivElement, ScopedProps<TabListProps>>(
  (props, forwardedRef) => {
    const { __scopeTabs, onKeyDown, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const listRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, listRef);
    const isHorizontal = context.orientation === 'horizontal';

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const list = listRef.current;
      if (!list) return;

      const tabs = Array.from(
        list.querySelectorAll<HTMLElement>('[role="tab"]:not([data-disabled])'),
      );
      if (tabs.length === 0) return;

      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

      let nextIndex: number | undefined;
      if (event.key === nextKey) nextIndex = (currentIndex + 1) % tabs.length;
      else if (event.key === prevKey) nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;

      if (nextIndex === undefined) return;

      event.preventDefault();
      // Arrow keys always move focus; in 'automatic' mode, `Tab`'s onFocus
      // handler selects the newly-focused tab, so we don't select here too.
      tabs[nextIndex]?.focus();
    };

    return (
      <Primitive
        as="div"
        role="tablist"
        aria-orientation={context.orientation}
        data-orientation={context.orientation}
        {...listProps}
        ref={composedRef}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      />
    );
  },
);

TabList.displayName = TAB_LIST_NAME;

export { TabList };
export type { TabListProps };
