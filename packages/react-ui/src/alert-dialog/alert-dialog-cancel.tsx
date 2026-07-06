import { cn } from '@nebula/primitives/cn';
import { AlertDialogCancel as StylelessAlertDialogCancel } from '@nebula/styleless/alert-dialog';
import * as React from 'react';

import type { AlertDialogCancelProps as StylelessAlertDialogCancelProps } from '@nebula/styleless/alert-dialog';

type AlertDialogCancelProps = StylelessAlertDialogCancelProps;

/** Plain, unfilled treatment — sits beside `AlertDialogAction`'s filled `danger` button without competing with it visually. */
const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessAlertDialogCancel
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-[var(--radius-button)] border border-[var(--dialog-content-border)] px-4 text-sm font-medium text-[var(--dialog-text)] outline-none hover:bg-[var(--dialog-content-border)]/20 focus-visible:ring-2 focus-visible:ring-[var(--dialog-text)] focus-visible:ring-offset-1',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

AlertDialogCancel.displayName = 'AlertDialogCancel';

export { AlertDialogCancel };
export type { AlertDialogCancelProps };
