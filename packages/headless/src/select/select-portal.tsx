import { Portal } from '@nebula/primitives/portal';
import * as React from 'react';

import type { PortalProps } from '@nebula/primitives/portal';

const SELECT_PORTAL_NAME = 'SelectPortal';

type SelectPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula/primitives`' `Portal` — same rationale as
 * `PopoverPortal`/`DialogPortal`. `SelectContent` handles its own
 * `Presence`-gated mount/unmount, so this doesn't need to gate on `open`
 * itself.
 *
 * @example
 * ```tsx
 * <SelectPortal>
 *   <SelectContent>...</SelectContent>
 * </SelectPortal>
 * ```
 */
const SelectPortal = React.forwardRef<HTMLDivElement, SelectPortalProps>((props, forwardedRef) => (
  <Portal {...props} ref={forwardedRef} />
));

SelectPortal.displayName = SELECT_PORTAL_NAME;

export { SelectPortal };
export type { SelectPortalProps };
