import { ToastViewport as HeadlessToastViewport } from '@nebula-lab/headless/toast';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { ToastViewportProps as HeadlessToastViewportProps } from '@nebula-lab/headless/toast';

type ToastViewportProps = HeadlessToastViewportProps;

/** Fixed to the bottom-right corner, stacking newest-on-top — the conventional toast placement; override `className` for a different corner. */
const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessToastViewport
        className={cn(
          'fixed bottom-0 right-0 z-[var(--z-overlay)] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-sm',
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
