import { cn } from '@nebula/primitives/cn';
import { MenuContent as StylelessMenuContent } from '@nebula/styleless/menu';
import * as React from 'react';

import type { MenuContentProps as StylelessMenuContentProps } from '@nebula/styleless/menu';

type MenuContentProps = StylelessMenuContentProps;

/** Same `base-100`/`base-300`/`base-content` surface treatment as `PopoverContent`/`SelectContent`. */
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessMenuContent
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
