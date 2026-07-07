import { AlertDialogContent as HeadlessAlertDialogContent } from '@nebula/headless/alert-dialog';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { AlertDialogContentProps as HeadlessAlertDialogContentProps } from '@nebula/headless/alert-dialog';

type AlertDialogContentProps = HeadlessAlertDialogContentProps;

/**
 * Same fixed, centered card treatment as `DialogContent` (reads the same
 * `--dialog-content-*` tokens — an alert dialog is the same visual surface,
 * just with a different dismissal contract), but deliberately has **no**
 * built-in icon close button: an `AlertDialogContent` is never dismissed by
 * an incidental click, only by an explicit `AlertDialogCancel`/
 * `AlertDialogAction` the consumer places in the body themselves.
 *
 * @example
 * ```tsx
 * <AlertDialogContent>
 *   <AlertDialogTitle>Delete this item?</AlertDialogTitle>
 *   <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
 *   <div className="mt-4 flex justify-end gap-2">
 *     <AlertDialogCancel>Cancel</AlertDialogCancel>
 *     <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
 *   </div>
 * </AlertDialogContent>
 * ```
 */
const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessAlertDialogContent
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-dialog)] border border-[var(--dialog-content-border)] bg-[var(--dialog-content-bg)] p-6 text-[var(--dialog-text)] shadow-lg focus-visible:outline-none',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

AlertDialogContent.displayName = 'AlertDialogContent';

export { AlertDialogContent };
export type { AlertDialogContentProps };
