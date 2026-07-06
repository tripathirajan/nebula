import { cn } from '@nebula/primitives/cn';
import { ToastAction as StylelessToastAction } from '@nebula/styleless/toast';
import * as React from 'react';

import type { ToastActionProps as StylelessToastActionProps } from '@nebula/styleless/toast';

type ToastActionProps = StylelessToastActionProps;

/** An underlined text action (e.g. "Undo") — deliberately not a full filled `Button`, so it reads as secondary to the toast's own message. */
const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessToastAction
        className={cn(
          'shrink-0 self-start rounded-[var(--radius-selector)] font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--toast-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

ToastAction.displayName = 'ToastAction';

export { ToastAction };
export type { ToastActionProps };
