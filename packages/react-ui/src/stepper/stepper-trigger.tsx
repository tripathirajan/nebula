import { StepperTrigger as HeadlessStepperTrigger } from '@nebula-lab/headless/stepper';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { StepperTriggerProps as HeadlessStepperTriggerProps } from '@nebula-lab/headless/stepper';

type StepperTriggerProps = HeadlessStepperTriggerProps;

/** Wraps `StepperIndicator`/`StepperTitle` — disabled steps fade rather than fully hide, so the sequence stays visible. */
const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessStepperTrigger
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
