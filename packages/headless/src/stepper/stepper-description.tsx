import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useStepperItemContext } from './stepper-item-context';

import type { ItemScopedProps } from './stepper-item-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const STEPPER_DESCRIPTION_NAME = 'StepperDescription';

type StepperDescriptionProps = PrimitivePropsWithRef<'span'>;

/**
 * A step's secondary text, e.g. `"Personal details"` under a `StepperTitle`
 * of `"Account"`. Optional — omit it for a title-only step.
 *
 * @example
 * ```tsx
 * <StepperTitle>Account</StepperTitle>
 * <StepperDescription>Personal details</StepperDescription>
 * ```
 */
const StepperDescription = React.forwardRef<
  HTMLSpanElement,
  ItemScopedProps<StepperDescriptionProps>
>((props, forwardedRef) => {
  const { __scopeStepperItem, ...rest } = props;
  const itemContext = useStepperItemContext(STEPPER_DESCRIPTION_NAME, __scopeStepperItem);
  return <Primitive as="span" data-state={itemContext.status} {...rest} ref={forwardedRef} />;
});

StepperDescription.displayName = STEPPER_DESCRIPTION_NAME;

export { StepperDescription };
export type { StepperDescriptionProps };
