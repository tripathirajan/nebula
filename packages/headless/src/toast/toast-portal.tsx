import { Portal } from '@nebula-lab/primitives/portal';
import * as React from 'react';

import type { PortalProps } from '@nebula-lab/primitives/portal';

const TOAST_PORTAL_NAME = 'ToastPortal';

type ToastPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula-lab/primitives`' `Portal` — wraps `ToastViewport`
 * (once, near the root of an app), not each individual `Toast`, unlike
 * `DialogPortal`/`PopoverPortal` which wrap one piece of overlay content per
 * open/close cycle.
 *
 * @example
 * ```tsx
 * <ToastPortal>
 *   <ToastViewport>
 *     {toasts.map((toast) => <Toast key={toast.id} {...toast} />)}
 *   </ToastViewport>
 * </ToastPortal>
 * ```
 */
const ToastPortal = React.forwardRef<HTMLDivElement, ToastPortalProps>((props, forwardedRef) => (
  <Portal {...props} ref={forwardedRef} />
));

ToastPortal.displayName = TOAST_PORTAL_NAME;

export { ToastPortal };
export type { ToastPortalProps };
