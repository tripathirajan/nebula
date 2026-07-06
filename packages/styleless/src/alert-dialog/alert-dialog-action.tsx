// Thin renamed re-export — "Action" (the confirming button, e.g. "Delete")
// has the exact same contract as `DialogClose`: closes on click, composing
// whatever `onClick` the consumer provides (e.g. the actual delete call).
// Kept as its own named export distinct from `AlertDialogCancel` purely for
// semantic clarity at the call site and so `react-ui` can give the two
// different default styling (a destructive/primary button vs. a plain one)
// — the underlying behavior contract is identical. See `alert-dialog.tsx`.
export { DialogClose as AlertDialogAction } from '../dialog/dialog-close';
export type { DialogCloseProps as AlertDialogActionProps } from '../dialog/dialog-close';
