import { useControllableState } from '@nebula/hooks';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { StepperProvider } from './stepper-context';

import type { ScopedProps, StepperOrientation } from './stepper-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface StepperProps extends PrimitivePropsWithRef<'nav'> {
  /** Controlled: the current (0-indexed) step. */
  step?: number;
  /** Uncontrolled: the initial (0-indexed) step. */
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** @default 'horizontal' */
  orientation?: StepperOrientation;
  /** See `StepperContextValue.allowSkipAhead`. @default false */
  allowSkipAhead?: boolean;
}

/**
 * Root of the Stepper compound component — a `<nav>` (a stepper is, at its
 * core, navigation over an ordered sequence of steps, same reasoning as
 * `Pagination`) wrapping `StepperList`/`StepperItem`/`StepperTrigger`. There's
 * no ARIA Authoring Practice pattern named "stepper"; this shape (nav > ol >
 * li > button, `aria-current="step"` on the active one) follows the same
 * "plain landmark + list" approach `Breadcrumb`/`Pagination` use rather than
 * inventing custom ARIA.
 *
 * @example
 * ```tsx
 * <Stepper step={step} onStepChange={setStep}>
 *   <StepperList>
 *     <StepperItem index={0}>
 *       <StepperTrigger>
 *         <StepperIndicator>1</StepperIndicator>
 *         <StepperTitle>Account</StepperTitle>
 *       </StepperTrigger>
 *     </StepperItem>
 *     <StepperSeparator />
 *     <StepperItem index={1}>
 *       <StepperTrigger>
 *         <StepperIndicator>2</StepperIndicator>
 *         <StepperTitle>Payment</StepperTitle>
 *       </StepperTrigger>
 *     </StepperItem>
 *   </StepperList>
 * </Stepper>
 * ```
 */
const Stepper = React.forwardRef<HTMLElement, ScopedProps<StepperProps>>(
  (props, forwardedRef) => {
    const {
      __scopeStepper,
      step: stepProp,
      defaultStep = 0,
      onStepChange,
      orientation = 'horizontal',
      allowSkipAhead = false,
      'aria-label': ariaLabel,
      ...navProps
    } = props;

    const [step, setStep] = useControllableState<number>({
      prop: stepProp,
      defaultProp: defaultStep,
      onChange: onStepChange,
    });

    return (
      <StepperProvider
        scope={__scopeStepper}
        step={step ?? defaultStep}
        onStepChange={setStep}
        orientation={orientation}
        allowSkipAhead={allowSkipAhead}
      >
        <Primitive
          as="nav"
          aria-label={ariaLabel ?? 'progress'}
          data-orientation={orientation}
          {...navProps}
          ref={forwardedRef}
        />
      </StepperProvider>
    );
  },
);

Stepper.displayName = 'Stepper';

export { Stepper };
export type { StepperProps };
