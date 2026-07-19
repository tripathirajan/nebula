import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useToastContext } from './toast-context';

import type { ScopedProps } from './toast-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const TOAST_CLOSE_NAME = 'ToastClose';

type ToastCloseProps = PrimitivePropsWithRef<'button'>;

/**
 * Dismisses the toast on click. No special ARIA beyond being a normal
 * button — give it an accessible label (visible text, or `aria-label` if
 * it's an icon button), same as `DialogClose`.
 *
 * @example
 * ```tsx
 * <ToastClose aria-label="Dismiss">×</ToastClose>
 * ```
 */
const ToastClose = React.forwardRef<HTMLButtonElement, ScopedProps<ToastCloseProps>>(
  (props, forwardedRef) => {
    const { __scopeToast, onClick, ...closeProps } = props;
    const context = useToastContext(TOAST_CLOSE_NAME, __scopeToast);

    return (
      <Primitive
        as="button"
        type="button"
        {...closeProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => context.onOpenChange(false))}
      />
    );
  },
);

ToastClose.displayName = TOAST_CLOSE_NAME;

export { ToastClose };
export type { ToastCloseProps };
