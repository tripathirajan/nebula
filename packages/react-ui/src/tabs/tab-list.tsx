import { cn } from '@nebula/primitives/cn';
import { TabList as StylelessTabList } from '@nebula/styleless/tabs';
import * as React from 'react';

import type { TabListProps as StylelessTabListProps } from '@nebula/styleless/tabs';

type TabListProps = StylelessTabListProps;

/**
 * Styled wrapper around `@nebula/styleless`'s `TabList` — arrow-key roving
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
    <StylelessTabList
      className={cn('flex gap-4 border-b border-[var(--tabs-list-border)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

TabList.displayName = 'TabList';

export { TabList };
export type { TabListProps };
