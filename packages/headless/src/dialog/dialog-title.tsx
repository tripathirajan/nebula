
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useDialogContext } from './dialog-context';

import type { ScopedProps } from './dialog-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const DIALOG_TITLE_NAME = 'DialogTitle';

type DialogTitleProps = PrimitivePropsWithRef<'h2'>;

/**
 * The dialog's accessible name — its `id` is what `DialogContent`'s
 * `aria-labelledby` points to. Required content per the WAI-ARIA Dialog
 * pattern (every dialog needs an accessible name); render one even if
 * visually hiding it (via `@nebula-lab/primitives`' `VisuallyHidden`) rather than
 * omitting it.
 *
 * @example
 * ```tsx
 * <DialogTitle>Delete item?</DialogTitle>
 * ```
 */
const DialogTitle = React.forwardRef<HTMLHeadingElement, ScopedProps<DialogTitleProps>>(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(DIALOG_TITLE_NAME, __scopeDialog);

    return <Primitive as="h2" id={context.titleId} {...titleProps} ref={forwardedRef} />;
  },
);

DialogTitle.displayName = DIALOG_TITLE_NAME;

export { DialogTitle };
export type { DialogTitleProps };
