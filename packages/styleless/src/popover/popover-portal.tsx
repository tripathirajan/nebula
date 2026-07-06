
import { Portal } from '@nebula/primitives/portal';
import * as React from 'react';


import type { PortalProps } from '@nebula/primitives/portal';

const POPOVER_PORTAL_NAME = 'PopoverPortal';

type PopoverPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula/primitives`' `Portal` — same rationale as
 * `DialogPortal`. `PopoverContent` handles its own `Presence`-gated
 * mount/unmount, so this doesn't need to gate on `open` itself.
 *
 * @example
 * ```tsx
 * <PopoverPortal>
 *   <PopoverContent>...</PopoverContent>
 * </PopoverPortal>
 * ```
 */
const PopoverPortal = React.forwardRef<HTMLDivElement, PopoverPortalProps>((props, forwardedRef) => (
  <Portal {...props} ref={forwardedRef} />
));

PopoverPortal.displayName = POPOVER_PORTAL_NAME;

export { PopoverPortal };
export type { PopoverPortalProps };
