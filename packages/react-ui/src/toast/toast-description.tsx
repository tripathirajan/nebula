import { cn } from '@nebula/primitives/cn';
import { ToastDescription as StylelessToastDescription } from '@nebula/styleless/toast';
import * as React from 'react';

import type { ToastDescriptionProps as StylelessToastDescriptionProps } from '@nebula/styleless/toast';

type ToastDescriptionProps = StylelessToastDescriptionProps;

const ToastDescription = React.forwardRef<HTMLDivElement, ToastDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessToastDescription
        className={cn('text-[var(--toast-text)]/80', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

ToastDescription.displayName = 'ToastDescription';

export { ToastDescription };
export type { ToastDescriptionProps };
