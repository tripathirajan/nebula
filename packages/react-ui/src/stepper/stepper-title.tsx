import { cn } from '@nebula/primitives/cn';
import { StepperTitle as StylelessStepperTitle } from '@nebula/styleless/stepper';
import * as React from 'react';

import type { StepperTitleProps as StylelessStepperTitleProps } from '@nebula/styleless/stepper';

type StepperTitleProps = StylelessStepperTitleProps;

/** The `current` step's title is bolded so the active step reads clearly at a glance. */
const StepperTitle = React.forwardRef<HTMLSpanElement, StepperTitleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessStepperTitle
        className={cn(
          'text-sm text-[var(--stepper-text)] data-[state=current]:font-semibold',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperTitle.displayName = 'StepperTitle';

export { StepperTitle };
export type { StepperTitleProps };
