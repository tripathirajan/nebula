// Thin renamed re-export — "Cancel" is exactly `DialogClose`'s contract
// (closes on click, no other side effect). See `alert-dialog.tsx`.
export { DialogClose as AlertDialogCancel } from '../dialog/dialog-close';
export type { DialogCloseProps as AlertDialogCancelProps } from '../dialog/dialog-close';
