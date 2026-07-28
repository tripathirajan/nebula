
import { Portal } from '@nebula-lab/primitives/portal';
import * as React from 'react';


import type { PortalProps } from '@nebula-lab/primitives/portal';

const MENU_PORTAL_NAME = 'MenuPortal';

type MenuPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula-lab/primitives`' `Portal` — same rationale as
 * `PopoverPortal`/`TooltipPortal`. `MenuContent` handles its own
 * `Presence`-gated mount/unmount, so this doesn't need to gate on `open`
 * itself.
 *
 * @example
 * ```tsx
 * <MenuPortal>
 *   <MenuContent>...</MenuContent>
 * </MenuPortal>
 * ```
 */
const MenuPortal = React.forwardRef<HTMLDivElement, MenuPortalProps>((props, forwardedRef) => (
  <Portal {...props} ref={forwardedRef} />
));

MenuPortal.displayName = MENU_PORTAL_NAME;

export { MenuPortal };
export type { MenuPortalProps };
