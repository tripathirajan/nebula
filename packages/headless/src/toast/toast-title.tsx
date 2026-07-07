import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useToastContext } from './toast-context';

import type { ScopedProps } from './toast-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const TOAST_TITLE_NAME = 'ToastTitle';

type ToastTitleProps = PrimitivePropsWithRef<'div'>;

/**
 * A toast's heading text. Its `id` (`titleId` from context) is available
 * for a consumer who wants to additionally wire up `aria-labelledby` — not
 * done automatically here, since `Toast`'s `role="status"` live region
 * already has its entire text content announced on update, unlike
 * `DialogContent`'s `aria-labelledby`, which is load-bearing for a dialog's
 * accessible name.
 *
 * @example
 * ```tsx
 * <ToastTitle>Upload complete</ToastTitle>
 * ```
 */
const ToastTitle = React.forwardRef<HTMLDivElement, ScopedProps<ToastTitleProps>>(
  (props, forwardedRef) => {
    const { __scopeToast, ...titleProps } = props;
    const context = useToastContext(TOAST_TITLE_NAME, __scopeToast);

    return <Primitive as="div" id={context.titleId} {...titleProps} ref={forwardedRef} />;
  },
);

ToastTitle.displayName = TOAST_TITLE_NAME;

export { ToastTitle };
export type { ToastTitleProps };
