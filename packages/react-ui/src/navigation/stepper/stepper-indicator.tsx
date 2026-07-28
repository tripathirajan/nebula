import { StepperIndicator as HeadlessStepperIndicator } from '@nebula-lab/headless/stepper';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { StepperIndicatorProps as HeadlessStepperIndicatorProps } from '@nebula-lab/headless/stepper';

type StepperIndicatorProps = HeadlessStepperIndicatorProps;

/**
 * A small circle badge — `upcoming` reads `--stepper-indicator-bg`/`-text`,
 * `current` and `complete` each swap to their own pair (see
 * `../tokens/component.ts`). `current` and `complete` share the same
 * `primary` fill by design (a completed step shouldn't visually regress to
 * looking "less done" than the active one — only `upcoming` looks distinct).
 */
const StepperIndicator = React.forwardRef<HTMLSpanElement, StepperIndicatorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessStepperIndicator
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--stepper-indicator-bg)] text-sm font-medium text-[var(--stepper-indicator-text)] data-[state=complete]:bg-[var(--stepper-complete-indicator-bg)] data-[state=complete]:text-[var(--stepper-complete-indicator-text)] data-[state=current]:bg-[var(--stepper-active-indicator-bg)] data-[state=current]:text-[var(--stepper-active-indicator-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperIndicator.displayName = 'StepperIndicator';

export { StepperIndicator };
export type { StepperIndicatorProps };
