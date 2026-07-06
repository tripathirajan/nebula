import { cn } from '@nebula/primitives/cn';
import { TabPanel as StylelessTabPanel } from '@nebula/styleless/tabs';
import * as React from 'react';

import type { TabPanelProps as StylelessTabPanelProps } from '@nebula/styleless/tabs';

type TabPanelProps = StylelessTabPanelProps;

/**
 * Styled wrapper around `@nebula/styleless`'s `TabPanel` — mount/unmount
 * (`forceMount`) and `role="tabpanel"` wiring come from there unchanged.
 * This layer only adds spacing above the panel content and resets the
 * focus outline (the panel itself is focusable per the WAI-ARIA Tabs
 * pattern, but doesn't need a visible ring the way an interactive control
 * does).
 *
 * @example
 * ```tsx
 * <TabPanel value="password">
 *   <PasswordForm />
 * </TabPanel>
 * ```
 */
const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessTabPanel
      className={cn('pt-4 text-sm text-[var(--tabs-trigger-text)] focus-visible:outline-none', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

TabPanel.displayName = 'TabPanel';

export { TabPanel };
export type { TabPanelProps };
