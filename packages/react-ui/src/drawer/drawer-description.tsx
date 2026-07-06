import { cn } from '@nebula/primitives/cn';
import { DrawerDescription as StylelessDrawerDescription } from '@nebula/styleless/drawer';
import * as React from 'react';

import type { DrawerDescriptionProps as StylelessDrawerDescriptionProps } from '@nebula/styleless/drawer';

type DrawerDescriptionProps = StylelessDrawerDescriptionProps;

const DrawerDescription = React.forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDrawerDescription
        className={cn('text-sm text-[var(--drawer-text)]/70', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DrawerDescription.displayName = 'DrawerDescription';

export { DrawerDescription };
export type { DrawerDescriptionProps };
