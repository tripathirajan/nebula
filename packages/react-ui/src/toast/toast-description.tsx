import { ToastDescription as HeadlessToastDescription } from '@nebula-lab/headless/toast';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { ToastDescriptionProps as HeadlessToastDescriptionProps } from '@nebula-lab/headless/toast';

type ToastDescriptionProps = HeadlessToastDescriptionProps;

const ToastDescription = React.forwardRef<HTMLDivElement, ToastDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessToastDescription
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
