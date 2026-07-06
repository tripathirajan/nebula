import { cn } from '@nebula/primitives/cn';
import { StepperDescription as StylelessStepperDescription } from '@nebula/styleless/stepper';
import * as React from 'react';

import type { StepperDescriptionProps as StylelessStepperDescriptionProps } from '@nebula/styleless/stepper';

type StepperDescriptionProps = StylelessStepperDescriptionProps;

/** Muted secondary line under `StepperTitle` — opacity modifier applied directly on the class, not baked into a token (see `component.ts`'s file header). */
const StepperDescription = React.forwardRef<HTMLSpanElement, StepperDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessStepperDescription
        className={cn('text-xs text-[var(--stepper-text)]/70', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperDescription.displayName = 'StepperDescription';

export { StepperDescription };
export type { StepperDescriptionProps };
