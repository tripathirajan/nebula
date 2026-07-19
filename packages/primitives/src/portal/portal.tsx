import * as React from 'react';
import { createPortal } from 'react-dom';

import { Primitive } from '../primitive/primitive';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

interface PortalOwnProps {
  /**
   * Where to portal into. Defaults to `document.body` — pass a specific
   * node for e.g. rendering inside a specific scroll container or a
   * shadow-DOM boundary.
   */
  container?: Element | DocumentFragment | null;
}

/** Props accepted by {@link Portal}. */
type PortalProps = PrimitivePropsWithRef<'div'> & PortalOwnProps;

/**
 * Renders its children into `container` (default `document.body`) instead
 * of in place in the React tree — the backbone every overlay
 * (`Dialog`/`Popover`/`Tooltip`/`Toast`, once built) is portaled through, so
 * `overflow: hidden`/`z-index` stacking contexts on an ancestor can't clip
 * or bury them. SSR-safe: renders nothing until mounted on the client,
 * since there's no `document` on the server.
 *
 * @example
 * ```tsx
 * <Portal>
 *   <DismissibleLayer onDismiss={onClose}>{content}</DismissibleLayer>
 * </Portal>
 *
 * // Custom mount point, e.g. `@nebula-lab/react-ui-blocks`' AppLayout portal root:
 * <Portal container={document.getElementById('nebula-portal-root')}>
 *   {content}
 * </Portal>
 * ```
 */
const Portal = React.forwardRef<HTMLDivElement, PortalProps>((props, forwardedRef) => {
  const { container, ...rest } = props;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const target = container ?? (typeof document !== 'undefined' ? document.body : null);
  if (!target) return null;

  return createPortal(<Primitive as="div" {...rest} ref={forwardedRef} />, target);
});

Portal.displayName = 'Portal';

export { Portal };
export type { PortalProps };
