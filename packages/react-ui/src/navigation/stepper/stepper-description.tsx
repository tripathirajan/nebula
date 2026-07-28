import { StepperDescription as HeadlessStepperDescription } from '@nebula-lab/headless/stepper';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { StepperDescriptionProps as HeadlessStepperDescriptionProps } from '@nebula-lab/headless/stepper';

type StepperDescriptionProps = HeadlessStepperDescriptionProps;

/** Muted secondary line under `StepperTitle` — opacity modifier applied directly on the class, not baked into a token (see `component.ts`'s file header). */
const StepperDescription = React.forwardRef<HTMLSpanElement, StepperDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessStepperDescription
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
