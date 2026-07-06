import { cn } from '@nebula/primitives/cn';
import { DrawerClose as StylelessDrawerClose } from '@nebula/styleless/drawer';
import * as React from 'react';

import type { DrawerCloseProps as StylelessDrawerCloseProps } from '@nebula/styleless/drawer';

type DrawerCloseProps = StylelessDrawerCloseProps;

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDrawerClose
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
