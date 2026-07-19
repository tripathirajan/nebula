import { DialogDescription as HeadlessDialogDescription } from '@nebula-lab/headless/dialog';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { DialogDescriptionProps as HeadlessDialogDescriptionProps } from '@nebula-lab/headless/dialog';

type DialogDescriptionProps = HeadlessDialogDescriptionProps;

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessDialogDescription
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
