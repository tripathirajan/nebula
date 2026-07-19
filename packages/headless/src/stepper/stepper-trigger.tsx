import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useStepperContext } from './stepper-context';
import { useStepperItemContext } from './stepper-item-context';

import type { ScopedProps } from './stepper-context';
import type { ItemScopedProps } from './stepper-item-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const STEPPER_TRIGGER_NAME = 'StepperTrigger';

type StepperTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * A `<button>` that jumps to this step. Disabled when `allowSkipAhead` is
 * false (the default) and this step is ahead of the current one — matches
 * the common "finish this step first" wizard constraint; set the root's
 * `allowSkipAhead` to allow free navigation instead. `aria-current="step"`
 * marks the active step, the enumerated token the ARIA spec defines
 * specifically for a step in a process (as opposed to `"page"`, which
 * `PaginationLink` uses).
 *
 * @example
 * ```tsx
 * <StepperTrigger>
 *   <StepperIndicator>1</StepperIndicator>
 *   <StepperTitle>Account</StepperTitle>
 * </StepperTrigger>
 * ```
 */
const StepperTrigger = React.forwardRef<
  HTMLButtonElement,
  ScopedProps<ItemScopedProps<StepperTriggerProps>>
>((props, forwardedRef) => {
  const { __scopeStepper, __scopeStepperItem, onClick, disabled: disabledProp, ...triggerProps } =
    props;
  const rootContext = useStepperContext(STEPPER_TRIGGER_NAME, __scopeStepper);
  const itemContext = useStepperItemContext(STEPPER_TRIGGER_NAME, __scopeStepperItem);
  const disabled =
    disabledProp ||
    itemContext.disabled ||
    (!rootContext.allowSkipAhead && itemContext.index > rootContext.step);

  return (
    <Primitive
      as="button"
      type="button"
      aria-current={itemContext.status === 'current' ? 'step' : undefined}
      data-state={itemContext.status}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      {...triggerProps}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) rootContext.onStepChange(itemContext.index);
      })}
    />
  );
});

StepperTrigger.displayName = STEPPER_TRIGGER_NAME;

export { StepperTrigger };
export type { StepperTriggerProps };
