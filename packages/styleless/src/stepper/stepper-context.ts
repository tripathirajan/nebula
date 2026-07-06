import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

type StepperOrientation = 'horizontal' | 'vertical';

interface StepperContextValue {
  step: number;
  onStepChange: (step: number) => void;
  orientation: StepperOrientation;
  /** When false (the default), `StepperTrigger` refuses to jump to a step
   * ahead of the current one — matches the common "must finish this step
   * before moving on" wizard behavior. Set true to allow free navigation
   * (e.g. a settings-style stepper where every section is independent). */
  allowSkipAhead: boolean;
}

const STEPPER_NAME = 'Stepper';

/**
 * Scoped context factory for the Stepper root — mirrors every other compound
 * component's use of `createContextScope`.
 */
const [createStepperContext, createStepperScope] = createContextScope(STEPPER_NAME);
const [StepperProvider, useStepperContext] =
  createStepperContext<StepperContextValue>(STEPPER_NAME);

/** Every consumer prop object accepts an optional internal `__scopeStepper` prop threaded through by `createStepperScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeStepper?: Scope<StepperContextValue> };

export { STEPPER_NAME, StepperProvider, useStepperContext, createStepperScope };
export type { StepperContextValue, StepperOrientation, ScopedProps };
