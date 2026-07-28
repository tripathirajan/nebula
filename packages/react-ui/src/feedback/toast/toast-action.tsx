import { ToastAction as HeadlessToastAction } from '@nebula-lab/headless/toast';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { ToastActionProps as HeadlessToastActionProps } from '@nebula-lab/headless/toast';

type ToastActionProps = HeadlessToastActionProps;

/** An underlined text action (e.g. "Undo") — deliberately not a full filled `Button`, so it reads as secondary to the toast's own message. */
const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessToastAction
        className={cn(
          'shrink-0 self-start rounded-[var(--radius-selector)] font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--toast-text)] focus-visible:ring-offset-1',
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
