import { StepperTitle as HeadlessStepperTitle } from '@nebula-lab/headless/stepper';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { StepperTitleProps as HeadlessStepperTitleProps } from '@nebula-lab/headless/stepper';

type StepperTitleProps = HeadlessStepperTitleProps;

/** The `current` step's title is bolded so the active step reads clearly at a glance. */
const StepperTitle = React.forwardRef<HTMLSpanElement, StepperTitleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessStepperTitle
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
