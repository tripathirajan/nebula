import { PopoverClose as HeadlessPopoverClose } from '@nebula-lab/headless/popover';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { PopoverCloseProps as HeadlessPopoverCloseProps } from '@nebula-lab/headless/popover';

type PopoverCloseProps = HeadlessPopoverCloseProps;

/** Same unopinionated-beyond-a-focus-ring approach as `Dialog`'s `DialogClose` — see that file for why. */
const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessPopoverClose
        className={cn(
          'rounded-[var(--radius-selector)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--popover-text)] focus-visible:ring-offset-1',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

PopoverClose.displayName = 'PopoverClose';

export { PopoverClose };
export type { PopoverCloseProps };
