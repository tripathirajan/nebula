import { DialogTitle as HeadlessDialogTitle } from '@nebula/headless/dialog';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { DialogTitleProps as HeadlessDialogTitleProps } from '@nebula/headless/dialog';

type DialogTitleProps = HeadlessDialogTitleProps;

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessDialogTitle
        className={cn('font-[var(--font-heading)] text-lg font-semibold', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DialogTitle.displayName = 'DialogTitle';

export { DialogTitle };
export type { DialogTitleProps };
