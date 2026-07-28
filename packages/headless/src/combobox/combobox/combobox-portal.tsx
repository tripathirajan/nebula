import { Portal } from '@nebula-lab/primitives/portal';
import * as React from 'react';

import type { PortalProps } from '@nebula-lab/primitives/portal';

const COMBOBOX_PORTAL_NAME = 'ComboboxPortal';

type ComboboxPortalProps = PortalProps;

/**
 * Thin re-export of `@nebula-lab/primitives`' `Portal` — same rationale as
 * `SelectPortal`/`PopoverPortal`.
 *
 * @example
 * ```tsx
 * <ComboboxPortal>
 *   <ComboboxContent>...</ComboboxContent>
 * </ComboboxPortal>
 * ```
 */
const ComboboxPortal = React.forwardRef<HTMLDivElement, ComboboxPortalProps>(
  (props, forwardedRef) => <Portal {...props} ref={forwardedRef} />,
);

ComboboxPortal.displayName = COMBOBOX_PORTAL_NAME;

export { ComboboxPortal };
export type { ComboboxPortalProps };
