import { MenuContent as HeadlessMenuContent } from '@nebula/headless/menu';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { MenuContentProps as HeadlessMenuContentProps } from '@nebula/headless/menu';

type MenuContentProps = HeadlessMenuContentProps;

/**
 * Same `base-100`/`base-300`/`base-content` surface treatment as
 * `PopoverContent`/`SelectContent` — including the same
 * `--motion-duration-fast`/`--elevation-anchored` fade/scale transition
 * (see `PopoverContent`'s doc comment for why).
 */
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessMenuContent
      className={cn(
        'z-[var(--z-overlay)] min-w-40 overflow-hidden rounded-[var(--radius-popover)] border border-[var(--menu-content-border)] bg-[var(--menu-content-bg)] p-1 text-[var(--menu-text)] shadow-[var(--elevation-anchored)] transition-[opacity,transform] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)] focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
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
