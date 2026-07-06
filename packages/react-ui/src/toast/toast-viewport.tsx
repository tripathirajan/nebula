import { cn } from '@nebula/primitives/cn';
import { ToastViewport as StylelessToastViewport } from '@nebula/styleless/toast';
import * as React from 'react';

import type { ToastViewportProps as StylelessToastViewportProps } from '@nebula/styleless/toast';

type ToastViewportProps = StylelessToastViewportProps;

/** Fixed to the bottom-right corner, stacking newest-on-top — the conventional toast placement; override `className` for a different corner. */
const ToastViewport = React.forwardRef<HTMLOListElement, ToastViewportProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessToastViewport
        className={cn(
          'fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-sm',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

ToastViewport.displayName = 'ToastViewport';

export { ToastViewport };
export type { ToastViewportProps };
