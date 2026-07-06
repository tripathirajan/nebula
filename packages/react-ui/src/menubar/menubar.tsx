import { cn } from '@nebula/primitives/cn';
import { Menubar as StylelessMenubar } from '@nebula/styleless/menubar';
import * as React from 'react';

import type { MenubarProps as StylelessMenubarProps } from '@nebula/styleless/menubar';

type MenubarProps = StylelessMenubarProps;

/**
 * Unlike this package's own `Menu` (whose root renders no visible DOM of its
 * own), `Menubar`'s root *is* the horizontal bar itself — it renders
 * `RovingFocusGroup` directly rather than through a portal, so it's the one
 * root in this family that needs real layout styling. Relies on the
 * `className` passthrough added to `@nebula/styleless`'s `Menubar` for this.
 */
const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessMenubar
      className={cn(
        'flex items-center gap-1 rounded-[var(--radius-field)] border border-[var(--menubar-border)] bg-[var(--menubar-bg)] p-1',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Menubar.displayName = 'Menubar';

export { Menubar };
export type { MenubarProps };
