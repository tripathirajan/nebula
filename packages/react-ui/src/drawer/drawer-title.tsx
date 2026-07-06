import { cn } from '@nebula/primitives/cn';
import { DrawerTitle as StylelessDrawerTitle } from '@nebula/styleless/drawer';
import * as React from 'react';

import type { DrawerTitleProps as StylelessDrawerTitleProps } from '@nebula/styleless/drawer';

type DrawerTitleProps = StylelessDrawerTitleProps;

const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDrawerTitle
        className={cn('font-[var(--font-heading)] text-lg font-semibold', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DrawerTitle.displayName = 'DrawerTitle';

export { DrawerTitle };
export type { DrawerTitleProps };
