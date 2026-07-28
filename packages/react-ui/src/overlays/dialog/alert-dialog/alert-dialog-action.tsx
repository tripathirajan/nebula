import { AlertDialogAction as HeadlessAlertDialogAction } from '@nebula-lab/headless/alert-dialog';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { AlertDialogActionProps as HeadlessAlertDialogActionProps } from '@nebula-lab/headless/alert-dialog';

type AlertDialogActionProps = HeadlessAlertDialogActionProps;

/**
 * The confirming button (e.g. "Delete") — same close-on-click contract as
 * `AlertDialogCancel` (both are `DialogClose` underneath, see the headless
 * source), but styled to look like a filled `danger`-toned `Button` rather
 * than `AlertDialogCancel`'s plain treatment, since this is the one that
 * commits the destructive/confirming action.
 *
 * Focus ring reads `--color-base-content`, not `--button-danger-bg` (i.e.
 * raw `--color-error`) — same reasoning `Button`'s own doc comment gives for
 * ringing every color in one uniform neutral rather than its own fill,
 * and here it's not optional: `error` measures 2.92:1 against `base.100` in
 * light mode (`contrast-audit.ts`), under WCAG 1.4.11's 3:1 non-text
 * minimum. `AlertDialogCancel` already rings on this same `--dialog-text`
 * (= `--color-base-content`) token; this now matches it instead of
 * diverging.
 */
const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessAlertDialogAction
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--button-danger-bg)] px-4 text-sm font-medium text-[var(--button-danger-text)] outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[var(--color-base-content)] focus-visible:ring-offset-1',
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
