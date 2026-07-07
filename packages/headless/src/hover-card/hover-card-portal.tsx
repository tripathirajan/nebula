import { Portal } from '@nebula/primitives/portal';
import * as React from 'react';

import type { PortalProps } from '@nebula/primitives/portal';

const HOVER_CARD_PORTAL_NAME = 'HoverCardPortal';

type HoverCardPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula/primitives`' `Portal` — same rationale as
 * `PopoverPortal`. `HoverCardContent` handles its own `Presence`-gated
 * mount/unmount, so this doesn't need to gate on `open` itself.
 *
 * @example
 * ```tsx
 * <HoverCardPortal>
 *   <HoverCardContent>...</HoverCardContent>
 * </HoverCardPortal>
 * ```
 */
const HoverCardPortal = React.forwardRef<HTMLDivElement, HoverCardPortalProps>(
  (props, forwardedRef) => <Portal {...props} ref={forwardedRef} />,
);

HoverCardPortal.displayName = HOVER_CARD_PORTAL_NAME;

export { HoverCardPortal };
export type { HoverCardPortalProps };
