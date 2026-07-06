import { cn } from '@nebula/primitives/cn';
import { DialogTitle as StylelessDialogTitle } from '@nebula/styleless/dialog';
import * as React from 'react';

import type { DialogTitleProps as StylelessDialogTitleProps } from '@nebula/styleless/dialog';

type DialogTitleProps = StylelessDialogTitleProps;

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDialogTitle
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
