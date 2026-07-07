import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useToastContext } from './toast-context';

import type { ScopedProps } from './toast-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const TOAST_DESCRIPTION_NAME = 'ToastDescription';

type ToastDescriptionProps = PrimitivePropsWithRef<'div'>;

/**
 * A toast's supporting text, e.g. `"report.pdf was uploaded successfully."`
 * under a `ToastTitle` of `"Upload complete"`. Optional — omit it for a
 * title-only toast.
 *
 * @example
 * ```tsx
 * <ToastDescription>report.pdf was uploaded successfully.</ToastDescription>
 * ```
 */
const ToastDescription = React.forwardRef<HTMLDivElement, ScopedProps<ToastDescriptionProps>>(
  (props, forwardedRef) => {
    const { __scopeToast, ...descriptionProps } = props;
    const context = useToastContext(TOAST_DESCRIPTION_NAME, __scopeToast);

    return (
      <Primitive as="div" id={context.descriptionId} {...descriptionProps} ref={forwardedRef} />
    );
  },
);

ToastDescription.displayName = TOAST_DESCRIPTION_NAME;

export { ToastDescription };
export type { ToastDescriptionProps };
