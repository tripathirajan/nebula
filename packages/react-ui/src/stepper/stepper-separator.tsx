import { StepperSeparator as HeadlessStepperSeparator } from '@nebula/headless/stepper';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { StepperSeparatorProps as HeadlessStepperSeparatorProps } from '@nebula/headless/stepper';

type StepperSeparatorProps = HeadlessStepperSeparatorProps;

/** The connecting line between two steps — a 1px rule on the axis perpendicular to reading order, sized to fill the remaining row/column space. */
const StepperSeparator = React.forwardRef<HTMLSpanElement, StepperSeparatorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessStepperSeparator
        className={cn(
          'mt-4 h-px flex-1 bg-[var(--stepper-separator)] data-[orientation=vertical]:mt-0 data-[orientation=vertical]:ml-4 data-[orientation=vertical]:h-8 data-[orientation=vertical]:w-px data-[orientation=vertical]:flex-none',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperSeparator.displayName = 'StepperSeparator';

export { StepperSeparator };
export type { StepperSeparatorProps };
