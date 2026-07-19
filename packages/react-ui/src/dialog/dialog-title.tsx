import { DialogTitle as HeadlessDialogTitle } from '@nebula-lab/headless/dialog';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { DialogTitleProps as HeadlessDialogTitleProps } from '@nebula-lab/headless/dialog';

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
