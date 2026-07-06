import { cn } from '@nebula/primitives/cn';
import { StepperTrigger as StylelessStepperTrigger } from '@nebula/styleless/stepper';
import * as React from 'react';

import type { StepperTriggerProps as StylelessStepperTriggerProps } from '@nebula/styleless/stepper';

type StepperTriggerProps = StylelessStepperTriggerProps;

/** Wraps `StepperIndicator`/`StepperTitle` — disabled steps fade rather than fully hide, so the sequence stays visible. */
const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessStepperTrigger
        className={cn(
          'flex flex-col items-center gap-1 rounded-[var(--radius-selector)] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stepper-active-indicator-bg)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperTrigger.displayName = 'StepperTrigger';

export { StepperTrigger };
export type { StepperTriggerProps };
