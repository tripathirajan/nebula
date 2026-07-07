import { DrawerClose as HeadlessDrawerClose } from '@nebula/headless/drawer';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { DrawerCloseProps as HeadlessDrawerCloseProps } from '@nebula/headless/drawer';

type DrawerCloseProps = HeadlessDrawerCloseProps;

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessDrawerClose
        className={cn(
          'rounded-[var(--radius-selector)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--drawer-text)] focus-visible:ring-offset-1',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DrawerClose.displayName = 'DrawerClose';

export { DrawerClose };
export type { DrawerCloseProps };
