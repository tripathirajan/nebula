import { AlertDialogCancel as HeadlessAlertDialogCancel } from '@nebula-lab/headless/alert-dialog';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { AlertDialogCancelProps as HeadlessAlertDialogCancelProps } from '@nebula-lab/headless/alert-dialog';

type AlertDialogCancelProps = HeadlessAlertDialogCancelProps;

/** Plain, unfilled treatment — sits beside `AlertDialogAction`'s filled `danger` button without competing with it visually. */
const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessAlertDialogCancel
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
