
import { DismissibleLayer } from '@nebula/primitives/dismissible-layer';
import { FocusScope } from '@nebula/primitives/focus-scope';
import { Presence } from '@nebula/primitives/presence';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import { useDialogContext } from '../dialog/dialog-context';

import type { ScopedProps } from '../dialog/dialog-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const ALERT_DIALOG_CONTENT_NAME = 'AlertDialogContent';

interface AlertDialogContentProps extends PrimitivePropsWithRef<'div'> {
  /** Keep mounted while closed instead of unmounting — same escape hatch as `DialogContent`'s `forceMount`. @default false */
  forceMount?: boolean;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop Escape from closing the dialog. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
}

/**
 * `role="alertdialog"` — the WAI-ARIA Alert Dialog pattern, a `Dialog`
 * variant for interruptions that demand an explicit response (confirming a
 * destructive action, a blocking error) rather than being casually dismissed.
 * Reuses `Dialog`'s context directly (via `useDialogContext`, imported across
 * from `../dialog/dialog-context` — same cross-folder relative-import
 * pattern `DropdownMenu` uses for `Menu`'s context).
 *
 * The real difference from `DialogContent`: this deliberately has **no**
 * `onPointerDownOutside` prop at all, and its `DismissibleLayer` always calls
 * `event.preventDefault()` on an outside pointerdown — an alert dialog is
 * never dismissed by clicking away, only by an explicit
 * `AlertDialogAction`/`AlertDialogCancel`. Escape still closes it by default
 * (the common convention of treating Escape as "Cancel"), overridable via
 * `onEscapeKeyDown` exactly like `DialogContent`. Always `trapped` in
 * `FocusScope` regardless of any `modal` setting, since `AlertDialog`'s root
 * forces `modal` unconditionally (see `alert-dialog.tsx`).
 *
 * @example
 * ```tsx
 * <AlertDialogContent>
 *   <AlertDialogTitle>Delete this item?</AlertDialogTitle>
 *   <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
 *   <AlertDialogCancel>Cancel</AlertDialogCancel>
 *   <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
 * </AlertDialogContent>
 * ```
 */
const AlertDialogContent = React.forwardRef<HTMLDivElement, ScopedProps<AlertDialogContentProps>>(
  (props, forwardedRef) => {
    const { __scopeDialog, forceMount = false, onEscapeKeyDown, ...contentProps } = props;
    const context = useDialogContext(ALERT_DIALOG_CONTENT_NAME, __scopeDialog);

    return (
      <Presence present={forceMount || context.open}>
        <DismissibleLayer
          asChild
          ref={forwardedRef}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={(event) => event.preventDefault()}
          onDismiss={() => context.onOpenChange(false)}
        >
          <FocusScope asChild trapped>
            <Primitive
              as="div"
              role="alertdialog"
              id={context.contentId}
              aria-modal="true"
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

AlertDialogContent.displayName = ALERT_DIALOG_CONTENT_NAME;

export { AlertDialogContent };
export type { AlertDialogContentProps };
