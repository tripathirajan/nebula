import { cn } from '@nebula/primitives/cn';
import { AlertDialogAction as StylelessAlertDialogAction } from '@nebula/styleless/alert-dialog';
import * as React from 'react';

import type { AlertDialogActionProps as StylelessAlertDialogActionProps } from '@nebula/styleless/alert-dialog';

type AlertDialogActionProps = StylelessAlertDialogActionProps;

/**
 * The confirming button (e.g. "Delete") — same close-on-click contract as
 * `AlertDialogCancel` (both are `DialogClose` underneath, see the styleless
 * source), but styled to look like a filled `danger`-toned `Button` rather
 * than `AlertDialogCancel`'s plain treatment, since this is the one that
 * commits the destructive/confirming action.
 */
const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessAlertDialogAction
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--button-danger-bg)] px-4 text-sm font-medium text-[var(--button-danger-text)] outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[var(--button-danger-bg)] focus-visible:ring-offset-1',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

AlertDialogAction.displayName = 'AlertDialogAction';

export { AlertDialogAction };
export type { AlertDialogActionProps };
