
import { Overlay } from '@nebula-lab/primitives/overlay';
import { Presence } from '@nebula-lab/primitives/presence';
import * as React from 'react';


import { useDialogContext } from './dialog-context';

import type { ScopedProps } from './dialog-context';
import type { OverlayProps } from '@nebula-lab/primitives/overlay';

const DIALOG_OVERLAY_NAME = 'DialogOverlay';

interface DialogOverlayProps extends OverlayProps {
  /** Keep mounted while closed instead of unmounting — same escape hatch as `AccordionContent`/`TabPanel`'s `forceMount`. @default false */
  forceMount?: boolean;
}

/**
 * The dimmed backdrop behind `DialogContent`, rendered inside `DialogPortal`.
 * Needs no dismissal logic of its own — a pointerdown here is already
 * "outside `DialogContent`'s subtree" as far as `DismissibleLayer` (composed
 * into `DialogContent`) is concerned, so clicking it closes the dialog for
 * free.
 *
 * @example
 * ```tsx
 * <DialogOverlay className="bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
 * ```
 */
const DialogOverlay = React.forwardRef<HTMLDivElement, ScopedProps<DialogOverlayProps>>(
  (props, forwardedRef) => {
    const { __scopeDialog, forceMount = false, ...overlayProps } = props;
    const context = useDialogContext(DIALOG_OVERLAY_NAME, __scopeDialog);

    return (
      <Presence present={forceMount || context.open}>
        <Overlay
          data-state={context.open ? 'open' : 'closed'}
          {...overlayProps}
          ref={forwardedRef}
        />
      </Presence>
    );
  },
);

DialogOverlay.displayName = DIALOG_OVERLAY_NAME;

export { DialogOverlay };
export type { DialogOverlayProps };
