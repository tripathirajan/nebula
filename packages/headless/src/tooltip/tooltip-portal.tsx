
import { Portal } from '@nebula/primitives/portal';
import * as React from 'react';


import type { PortalProps } from '@nebula/primitives/portal';

const TOOLTIP_PORTAL_NAME = 'TooltipPortal';

type TooltipPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula/primitives`' `Portal` — same rationale as
 * `PopoverPortal`/`DialogPortal`. `TooltipContent` handles its own
 * `Presence`-gated mount/unmount, so this doesn't need to gate on `open`
 * itself.
 *
 * @example
 * ```tsx
 * <TooltipPortal>
 *   <TooltipContent>Helpful text</TooltipContent>
 * </TooltipPortal>
 * ```
 */
const TooltipPortal = React.forwardRef<HTMLDivElement, TooltipPortalProps>((props, forwardedRef) => (
  <Portal {...props} ref={forwardedRef} />
));

TooltipPortal.displayName = TOOLTIP_PORTAL_NAME;

export { TooltipPortal };
export type { TooltipPortalProps };
