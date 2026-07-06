import { Portal } from '@nebula/primitives/portal';
import * as React from 'react';

import type { PortalProps } from '@nebula/primitives/portal';

const NAVIGATION_MENU_PORTAL_NAME = 'NavigationMenuPortal';

type NavigationMenuPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula/primitives`' `Portal` — same rationale as
 * `PopoverPortal`/`DialogPortal`. `NavigationMenuContent` handles its own
 * `Presence`-gated mount/unmount, so this doesn't need to gate on `open`
 * itself.
 *
 * @example
 * ```tsx
 * <NavigationMenuPortal>
 *   <NavigationMenuContent>...</NavigationMenuContent>
 * </NavigationMenuPortal>
 * ```
 */
const NavigationMenuPortal = React.forwardRef<HTMLDivElement, NavigationMenuPortalProps>(
  (props, forwardedRef) => <Portal {...props} ref={forwardedRef} />,
);

NavigationMenuPortal.displayName = NAVIGATION_MENU_PORTAL_NAME;

export { NavigationMenuPortal };
export type { NavigationMenuPortalProps };
