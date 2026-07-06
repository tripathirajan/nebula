import { cn } from '@nebula/primitives/cn';
import { PopoverClose as StylelessPopoverClose } from '@nebula/styleless/popover';
import * as React from 'react';

import type { PopoverCloseProps as StylelessPopoverCloseProps } from '@nebula/styleless/popover';

type PopoverCloseProps = StylelessPopoverCloseProps;

/** Same unopinionated-beyond-a-focus-ring approach as `Dialog`'s `DialogClose` — see that file for why. */
const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessPopoverClose
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
