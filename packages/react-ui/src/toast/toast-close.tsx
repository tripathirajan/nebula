import { cn } from '@nebula/primitives/cn';
import { ToastClose as StylelessToastClose } from '@nebula/styleless/toast';
import * as React from 'react';

import type { ToastCloseProps as StylelessToastCloseProps } from '@nebula/styleless/toast';

type ToastCloseProps = StylelessToastCloseProps;

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>((props, forwardedRef) => {
  const { className, children, ...rest } = props;
  return (
    <StylelessToastClose
      className={cn(
        'ml-auto shrink-0 rounded-[var(--radius-selector)] text-[var(--toast-text)]/60 hover:text-[var(--toast-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--toast-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    >
      {children ?? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      )}
    </StylelessToastClose>
  );
});

ToastClose.displayName = 'ToastClose';

export { ToastClose };
export type { ToastCloseProps };
