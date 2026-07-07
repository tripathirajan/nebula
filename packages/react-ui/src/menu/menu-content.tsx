import { MenuContent as HeadlessMenuContent } from '@nebula/headless/menu';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { MenuContentProps as HeadlessMenuContentProps } from '@nebula/headless/menu';

type MenuContentProps = HeadlessMenuContentProps;

/** Same `base-100`/`base-300`/`base-content` surface treatment as `PopoverContent`/`SelectContent`. */
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessMenuContent
      className={cn(
        'z-50 min-w-40 overflow-hidden rounded-[var(--radius-popover)] border border-[var(--menu-content-border)] bg-[var(--menu-content-bg)] p-1 text-[var(--menu-text)] shadow-md focus-visible:outline-none',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

MenuContent.displayName = 'MenuContent';

export { MenuContent };
export type { MenuContentProps };
