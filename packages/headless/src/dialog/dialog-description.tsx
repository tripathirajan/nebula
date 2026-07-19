
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useDialogContext } from './dialog-context';

import type { ScopedProps } from './dialog-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const DIALOG_DESCRIPTION_NAME = 'DialogDescription';

type DialogDescriptionProps = PrimitivePropsWithRef<'p'>;

/**
 * Optional supporting text — its `id` is what `DialogContent`'s
 * `aria-describedby` points to. Unlike `DialogTitle` this isn't required;
 * registers its id with `Dialog` (via `useLayoutEffect`) so `DialogContent`'s
 * `aria-describedby` includes it only while this is actually mounted,
 * instead of dangling-referencing an id with no matching element when
 * omitted (still valid ARIA either way, but a dangling reference is a real,
 * flagged violation — see `Field`'s identical fix for the same problem).
 *
 * @example
 * ```tsx
 * <DialogDescription>This can't be undone.</DialogDescription>
 * ```
 */
const DialogDescription = React.forwardRef<HTMLParagraphElement, ScopedProps<DialogDescriptionProps>>(
  (props, forwardedRef) => {
    const { __scopeDialog, id, ...descriptionProps } = props;
    const context = useDialogContext(DIALOG_DESCRIPTION_NAME, __scopeDialog);
    const resolvedId = id ?? context.descriptionId;

    const { registerDescribedBy, unregisterDescribedBy } = context;
    React.useLayoutEffect(() => {
      registerDescribedBy(resolvedId);
      return () => unregisterDescribedBy(resolvedId);
    }, [registerDescribedBy, unregisterDescribedBy, resolvedId]);

    return <Primitive as="p" id={resolvedId} {...descriptionProps} ref={forwardedRef} />;
  },
);

DialogDescription.displayName = DIALOG_DESCRIPTION_NAME;

export { DialogDescription };
export type { DialogDescriptionProps };
