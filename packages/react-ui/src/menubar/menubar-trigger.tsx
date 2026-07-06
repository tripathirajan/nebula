import { cn } from '@nebula/primitives/cn';
import { MenubarTrigger as StylelessMenubarTrigger } from '@nebula/styleless/menubar';
import * as React from 'react';

import type { MenubarTriggerProps as StylelessMenubarTriggerProps } from '@nebula/styleless/menubar';

type MenubarTriggerProps = StylelessMenubarTriggerProps;

/**
 * A visible bar button (unlike `MenuTrigger`, typically an already-styled
 * `Button` passed `asChild`) — `Menubar`'s triggers ("File", "Edit", ...) are
 * plain labels directly in the bar, so this needs its own chrome: padding,
 * hover, and a `data-state=open` fill matching whichever menu is currently
 * showing.
 */
const MenubarTrigger = React.forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessMenubarTrigger
        className={cn(
          'rounded-[var(--radius-selector)] px-3 py-1.5 text-sm text-[var(--menubar-trigger-text)] outline-none hover:bg-[var(--menubar-trigger-hover-bg)] data-[state=open]:bg-[var(--menubar-trigger-open-bg)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

MenubarTrigger.displayName = 'MenubarTrigger';

export { MenubarTrigger };
export type { MenubarTriggerProps };
