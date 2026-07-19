// Thin renamed re-export of this package's own `Dialog` root — which itself
// renders no DOM of its own — mirrors `@nebula-lab/headless`'s
// `AlertDialog`-wraps-`Dialog` relationship.
export { Dialog as AlertDialog } from '../dialog/dialog';
export type { DialogProps as AlertDialogProps } from '../dialog/dialog';
