import { cn } from '@nebula/primitives/cn';
import { StepperItem as StylelessStepperItem } from '@nebula/styleless/stepper';
import * as React from 'react';

import type { StepperItemProps as StylelessStepperItemProps } from '@nebula/styleless/stepper';

type StepperItemProps = StylelessStepperItemProps;

/**
 * A single step's layout slot — `flex-1` on the horizontal axis so items
 * share the row evenly (matches `TabList`'s trigger-sizing approach), full
 * width on the vertical axis instead.
 */
const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessStepperItem
        className={cn(
          'flex flex-1 flex-col items-center gap-1 text-center data-[orientation=vertical]:flex-none data-[orientation=vertical]:flex-row data-[orientation=vertical]:text-left',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperItem.displayName = 'StepperItem';

export { StepperItem };
export type { StepperItemProps };
