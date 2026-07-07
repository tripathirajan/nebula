import { DrawerDescription as HeadlessDrawerDescription } from '@nebula/headless/drawer';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { DrawerDescriptionProps as HeadlessDrawerDescriptionProps } from '@nebula/headless/drawer';

type DrawerDescriptionProps = HeadlessDrawerDescriptionProps;

const DrawerDescription = React.forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessDrawerDescription
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
