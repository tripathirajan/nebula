
import { Portal } from '@nebula/primitives/portal';
import * as React from 'react';


import type { PortalProps } from '@nebula/primitives/portal';

const DIALOG_PORTAL_NAME = 'DialogPortal';

type DialogPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula/primitives`' `Portal`, so consumers of
 * `@nebula/headless/dialog` don't need a second import for it. Deliberately
 * does *not* gate on `open` here — `DialogOverlay`/`DialogContent` each wrap
 * themselves in their own `Presence`, so each can independently play its own
 * exit animation instead of one shared gate unmounting both instantly.
 *
 * @example
 * ```tsx
 * <DialogPortal>
 *   <DialogOverlay />
 *   <DialogContent>...</DialogContent>
 * </DialogPortal>
 * ```
 */
const DialogPortal = React.forwardRef<HTMLDivElement, DialogPortalProps>((props, forwardedRef) => (
  <Portal {...props} ref={forwardedRef} />
));

DialogPortal.displayName = DIALOG_PORTAL_NAME;

export { DialogPortal };
export type { DialogPortalProps };
