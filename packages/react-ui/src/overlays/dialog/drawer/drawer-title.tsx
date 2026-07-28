import { DrawerTitle as HeadlessDrawerTitle } from '@nebula-lab/headless/drawer';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { DrawerTitleProps as HeadlessDrawerTitleProps } from '@nebula-lab/headless/drawer';

type DrawerTitleProps = HeadlessDrawerTitleProps;

const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessDrawerTitle
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
