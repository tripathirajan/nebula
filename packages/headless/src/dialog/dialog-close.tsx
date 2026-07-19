
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useDialogContext } from './dialog-context';

import type { ScopedProps } from './dialog-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const DIALOG_CLOSE_NAME = 'DialogClose';

type DialogCloseProps = PrimitivePropsWithRef<'button'>;

/**
 * Closes the dialog on click. No special ARIA beyond being a normal button —
 * give it an accessible label (visible text, or `aria-label` if it's an
 * icon button) same as any other button.
 *
 * @example
 * ```tsx
 * <DialogClose aria-label="Close">×</DialogClose>
 * ```
 */
const DialogClose = React.forwardRef<HTMLButtonElement, ScopedProps<DialogCloseProps>>(
  (props, forwardedRef) => {
    const { __scopeDialog, onClick, ...closeProps } = props;
    const context = useDialogContext(DIALOG_CLOSE_NAME, __scopeDialog);

    return (
      <Primitive
        as="button"
        type="button"
        {...closeProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => context.onOpenChange(false))}
      />
    );
  },
);

DialogClose.displayName = DIALOG_CLOSE_NAME;

export { DialogClose };
export type { DialogCloseProps };
