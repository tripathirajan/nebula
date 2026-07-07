import { TabList as HeadlessTabList } from '@nebula/headless/tabs';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { TabListProps as HeadlessTabListProps } from '@nebula/headless/tabs';

type TabListProps = HeadlessTabListProps;

/**
 * Styled wrapper around `@nebula/headless`'s `TabList` — arrow-key roving
 * navigation (`role="tablist"`) comes from there unchanged. This layer adds
 * the bottom rule every `Tab` sits on top of (`--tabs-list-border`, see
 * `../tokens/component.ts`); each `Tab`'s active-state border overlaps it
 * via a negative margin (`-mb-px`, see `tab.tsx`).
 *
 * @example
 * ```tsx
 * <TabList>
 *   <Tab value="account">Account</Tab>
 *   <Tab value="password">Password</Tab>
 * </TabList>
 * ```
 */
const TabList = React.forwardRef<HTMLDivElement, TabListProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessTabList
      className={cn('flex gap-4 border-b border-[var(--tabs-list-border)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

TabList.displayName = 'TabList';

export { TabList };
export type { TabListProps };
