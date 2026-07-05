import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

/** Props accepted by {@link Overlay}. */
type OverlayProps = PrimitivePropsWithRef<'div'>;

/**
 * A full-viewport `fixed inset-0` layer — the dimmed backdrop behind a
 * modal `Dialog`. No color/opacity baked in (that's a styling choice, not a
 * structural one — set it via `className`, e.g. `bg-black/50`); pairs with
 * `Portal` (to escape any ancestor stacking context) and `DismissableLayer`
 * (to close on click).
 *
 * @example
 * ```tsx
 * <Portal>
 *   <Overlay className="bg-black/50" />
 *   <FocusScope trapped>{dialogContent}</FocusScope>
 * </Portal>
 * ```
 */
const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive as="div" {...rest} ref={forwardedRef} className={cn('fixed inset-0', className)} />
  );
});

Overlay.displayName = 'Overlay';

export { Overlay };
export type { OverlayProps };
