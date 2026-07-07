
import { useControllableState, useId } from '@nebula/hooks';
import * as React from 'react';


import { DialogProvider } from './dialog-context';

import type { ScopedProps } from './dialog-context';

interface DialogProps {
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Modal dialogs trap Tab/Shift+Tab within `DialogContent` (via `FocusScope`
   * `trapped`) and the WAI-ARIA pattern's `aria-modal="true"`. Non-modal
   * (`false`) still portals, focuses, and dismisses on Escape/outside-click,
   * but doesn't trap Tab — closer to a non-modal `Popover`.
   * @default true
   */
  modal?: boolean;
  children?: React.ReactNode;
}

/**
 * Root of the Dialog compound component — renders no DOM of its own (like
 * `DialogTrigger` and `DialogPortal`'s children are meant to be siblings, not
 * nested inside an extra wrapper element), just provides shared state via
 * scoped context. Follows the WAI-ARIA Dialog (Modal) pattern.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogPortal>
 *     <DialogOverlay />
 *     <DialogContent>
 *       <DialogTitle>Delete item?</DialogTitle>
 *       <DialogDescription>This can't be undone.</DialogDescription>
 *       <DialogClose>Cancel</DialogClose>
 *     </DialogContent>
 *   </DialogPortal>
 * </Dialog>
 * ```
 */
function Dialog(props: ScopedProps<DialogProps>) {
  const {
    __scopeDialog,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    modal = true,
    children,
  } = props;

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useId('nebula-dialog-content');
  const titleId = useId('nebula-dialog-title');
  const descriptionId = useId('nebula-dialog-description');

  return (
    <DialogProvider
      scope={__scopeDialog}
      open={open}
      onOpenChange={setOpen}
      modal={modal}
      contentId={contentId}
      titleId={titleId}
      descriptionId={descriptionId}
    >
      {children}
    </DialogProvider>
  );
}

export { Dialog };
export type { DialogProps };
