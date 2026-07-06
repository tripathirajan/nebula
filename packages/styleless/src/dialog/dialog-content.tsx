
import { DismissibleLayer } from '@nebula/primitives/dismissible-layer';
import { FocusScope } from '@nebula/primitives/focus-scope';
import { Presence } from '@nebula/primitives/presence';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import { useDialogContext } from './dialog-context';

import type { ScopedProps } from './dialog-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const DIALOG_CONTENT_NAME = 'DialogContent';

interface DialogContentProps extends PrimitivePropsWithRef<'div'> {
  /** Keep mounted while closed instead of unmounting — same escape hatch as `DialogOverlay`'s `forceMount`. @default false */
  forceMount?: boolean;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop Escape from closing the dialog. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop an outside click (including on `DialogOverlay`) from closing the dialog. */
  onPointerDownOutside?: (event: PointerEvent) => void;
}

/**
 * `role="dialog"`, rendered inside `DialogPortal`. Composes three behavior
 * primitives around the actual content element via `asChild`/`Slot` chaining
 * (so this is one real DOM node, not three nested wrapper `div`s):
 * `Presence` (mount/unmount timed with an exit animation), `DismissibleLayer`
 * (Escape / outside-click closes it, respecting layering if nested inside
 * another dialog/popover), `FocusScope` (`trapped` when the root's `modal` is
 * true, moves focus in on mount and restores it to the trigger on unmount).
 *
 * @example
 * ```tsx
 * <DialogContent aria-describedby={undefined}>
 *   <DialogTitle>Delete item?</DialogTitle>
 *   <DialogDescription>This can't be undone.</DialogDescription>
 *   <DialogClose>Cancel</DialogClose>
 * </DialogContent>
 * ```
 */
const DialogContent = React.forwardRef<HTMLDivElement, ScopedProps<DialogContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopeDialog,
      forceMount = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useDialogContext(DIALOG_CONTENT_NAME, __scopeDialog);

    return (
      <Presence present={forceMount || context.open}>
        <DismissibleLayer
          asChild
          ref={forwardedRef}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onDismiss={() => context.onOpenChange(false)}
        >
          <FocusScope asChild trapped={context.modal}>
            <Primitive
              as="div"
              role="dialog"
              id={context.contentId}
              aria-modal={context.modal}
              aria-labelledby={context.titleId}
              aria-describedby={context.descriptionId}
              data-state={context.open ? 'open' : 'closed'}
              {...contentProps}
            />
          </FocusScope>
        </DismissibleLayer>
      </Presence>
    );
  },
);

DialogContent.displayName = DIALOG_CONTENT_NAME;

export { DialogContent };
export type { DialogContentProps };
