import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const TOAST_VIEWPORT_NAME = 'ToastViewport';

type ToastViewportProps = PrimitivePropsWithRef<'div'>;

/**
 * `role="region"` container for `Toast`s, typically rendered once near the
 * root of an app (inside a `Portal` so it renders above everything else)
 * and defaulting `aria-label` to `"Notifications"`. Not an `<ol>`: each
 * `Toast` is `role="status"` for its own live-region announcement, which is
 * an invalid role override for an `<li>` (and invalidates the parent list
 * along with it) — a labelled region is the valid way to group a set of
 * independently-announced live regions. Deliberately simple otherwise —
 * unlike Radix's `ToastViewport`, this doesn't implement the F6/F8
 * keyboard shortcut to jump focus into the region or reverse tab-order
 * handling for visually-last-but-DOM-first toasts; a documented scope cut,
 * not an oversight, since a live region's whole point is that sighted and
 * screen-reader users alike are notified without needing to navigate to it
 * deliberately in the common case.
 *
 * @example
 * ```tsx
 * <ToastViewport>
 *   {toasts.map((toast) => <Toast key={toast.id} {...toast} />)}
 * </ToastViewport>
 * ```
 */
const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  (props, forwardedRef) => {
    const { 'aria-label': ariaLabel, ...viewportProps } = props;

    return (
      <Primitive
        as="div"
        role="region"
        aria-label={ariaLabel ?? 'Notifications'}
        {...viewportProps}
        ref={forwardedRef}
      />
    );
  },
);

ToastViewport.displayName = TOAST_VIEWPORT_NAME;

export { ToastViewport };
export type { ToastViewportProps };
