
import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import { useDialogContext } from './dialog-context';

import type { ScopedProps } from './dialog-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const DIALOG_TRIGGER_NAME = 'DialogTrigger';

type DialogTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * Opens the dialog on click. `aria-haspopup="dialog"` + `aria-expanded` +
 * `aria-controls` wired to `DialogContent`'s `id`, per the WAI-ARIA Dialog
 * pattern. Doesn't need its own ref-tracking for focus-restore-on-close —
 * `FocusScope` (composed into `DialogContent`) already captures
 * `document.activeElement` at mount time, which is this trigger in the
 * common case of the user clicking/activating it.
 *
 * @example
 * ```tsx
 * <DialogTrigger>Delete</DialogTrigger>
 * ```
 */
const DialogTrigger = React.forwardRef<HTMLButtonElement, ScopedProps<DialogTriggerProps>>(
  (props, forwardedRef) => {
    const { __scopeDialog, onClick, ...triggerProps } = props;
    const context = useDialogContext(DIALOG_TRIGGER_NAME, __scopeDialog);

    return (
      <Primitive
        as="button"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={context.open ? 'open' : 'closed'}
        {...triggerProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => context.onOpenChange(true))}
      />
    );
  },
);

DialogTrigger.displayName = DIALOG_TRIGGER_NAME;

export { DialogTrigger };
export type { DialogTriggerProps };
