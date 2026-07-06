
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import { useDialogContext } from './dialog-context';

import type { ScopedProps } from './dialog-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const DIALOG_DESCRIPTION_NAME = 'DialogDescription';

type DialogDescriptionProps = PrimitivePropsWithRef<'p'>;

/**
 * Optional supporting text — its `id` is what `DialogContent`'s
 * `aria-describedby` points to. Unlike `DialogTitle` this isn't required;
 * `DialogContent`'s `aria-describedby` simply has nothing to point at
 * usefully if omitted (still valid, just less descriptive for AT users).
 *
 * @example
 * ```tsx
 * <DialogDescription>This can't be undone.</DialogDescription>
 * ```
 */
const DialogDescription = React.forwardRef<HTMLParagraphElement, ScopedProps<DialogDescriptionProps>>(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DIALOG_DESCRIPTION_NAME, __scopeDialog);

    return (
      <Primitive as="p" id={context.descriptionId} {...descriptionProps} ref={forwardedRef} />
    );
  },
);

DialogDescription.displayName = DIALOG_DESCRIPTION_NAME;

export { DialogDescription };
export type { DialogDescriptionProps };
