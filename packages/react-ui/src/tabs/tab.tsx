import { Tab as HeadlessTab } from '@nebula/headless/tabs';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { TabProps as HeadlessTabProps } from '@nebula/headless/tabs';

type TabProps = HeadlessTabProps;

/**
 * Styled wrapper around `@nebula/headless`'s `Tab` — selection,
 * `role="tab"`, and automatic/manual activation-mode handling all come
 * from there unchanged. This layer adds the underline treatment: a
 * transparent 2px bottom border that becomes `--tabs-trigger-active-border`
 * (see `../tokens/component.ts`) on `data-state="active"`, overlapping
 * `TabList`'s own border via `-mb-px`.
 *
 * @example
 * ```tsx
 * <Tab value="password" disabled={!hasAccount}>Password</Tab>
 * ```
 */
const Tab = React.forwardRef<HTMLButtonElement, TabProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessTab
      className={cn(
        '-mb-px border-b-2 border-transparent px-1 py-2 text-sm font-medium text-[var(--tabs-trigger-text)]/70 transition-colors hover:text-[var(--tabs-trigger-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tabs-trigger-active-border)] focus-visible:ring-inset data-[state=active]:border-[var(--tabs-trigger-active-border)] data-[state=active]:text-[var(--tabs-trigger-active-text)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Tab.displayName = 'Tab';

export { Tab };
export type { TabProps };
