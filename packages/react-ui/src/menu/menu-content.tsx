import { MenuContent as HeadlessMenuContent } from '@nebula/headless/menu';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { MenuContentProps as HeadlessMenuContentProps } from '@nebula/headless/menu';

type MenuContentProps = HeadlessMenuContentProps;

/**
 * Same `base-100`/`base-300`/`base-content` surface treatment as
 * `PopoverContent`/`SelectContent` — including the same fade/scale
 * `data-[state]` transition (see `PopoverContent`'s doc comment for why).
 */
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessMenuContent
      className={cn(
        'z-50 min-w-40 overflow-hidden rounded-[var(--radius-popover)] border border-[var(--menu-content-border)] bg-[var(--menu-content-bg)] p-1 text-[var(--menu-text)] shadow-md transition-[opacity,transform] duration-150 ease-out focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
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
