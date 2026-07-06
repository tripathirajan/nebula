import { cn } from '@nebula/primitives/cn';
import { DialogDescription as StylelessDialogDescription } from '@nebula/styleless/dialog';
import * as React from 'react';

import type { DialogDescriptionProps as StylelessDialogDescriptionProps } from '@nebula/styleless/dialog';

type DialogDescriptionProps = StylelessDialogDescriptionProps;

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDialogDescription
        className={cn('text-sm text-[var(--dialog-text)]/70', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DialogDescription.displayName = 'DialogDescription';

export { DialogDescription };
export type { DialogDescriptionProps };
