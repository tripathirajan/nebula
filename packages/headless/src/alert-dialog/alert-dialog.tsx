
import { Dialog } from '../dialog/dialog';

import type { DialogProps } from '../dialog/dialog';
import type { ScopedProps } from '../dialog/dialog-context';

type AlertDialogProps = Omit<DialogProps, 'modal'>;

/**
 * Root of the AlertDialog compound component — a thin wrapper around
 * `Dialog`'s root (reusing its context/scope directly, see
 * `alert-dialog-content.tsx`) that forces `modal={true}` unconditionally: an
 * alert dialog that didn't trap focus would let a user tab past an
 * unanswered prompt, defeating the whole point of interrupting them, so
 * `modal` isn't exposed as a prop here at all rather than merely defaulted.
 *
 * `AlertDialogTrigger`/`AlertDialogPortal`/`AlertDialogOverlay`/
 * `AlertDialogTitle`/`AlertDialogDescription`/`AlertDialogCancel` are thin
 * renamed re-exports of `Dialog`'s parts (same reasoning `DropdownMenu`
 * re-exports `Menu`'s parts) — only this root and `AlertDialogContent`
 * (`role="alertdialog"`, no outside-click dismissal) have real behavioral
 * differences from `Dialog`.
 *
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger>Delete</AlertDialogTrigger>
 *   <AlertDialogPortal>
 *     <AlertDialogOverlay />
 *     <AlertDialogContent>
 *       <AlertDialogTitle>Delete this item?</AlertDialogTitle>
 *       <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
 *     </AlertDialogContent>
 *   </AlertDialogPortal>
 * </AlertDialog>
 * ```
 */
function AlertDialog(props: ScopedProps<AlertDialogProps>) {
  return <Dialog {...props} modal />;
}

export { AlertDialog };
export type { AlertDialogProps };
