import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useStepperItemContext } from './stepper-item-context';

import type { ItemScopedProps } from './stepper-item-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const STEPPER_TITLE_NAME = 'StepperTitle';

type StepperTitleProps = PrimitivePropsWithRef<'span'>;

/**
 * A step's visible label, e.g. `"Account"`. Rendered alongside
 * `StepperIndicator` inside `StepperTrigger` — since `StepperIndicator` is
 * `aria-hidden`, this text is what actually gives the trigger its
 * accessible name.
 *
 * @example
 * ```tsx
 * <StepperTitle>Account</StepperTitle>
 * ```
 */
const StepperTitle = React.forwardRef<HTMLSpanElement, ItemScopedProps<StepperTitleProps>>(
  (props, forwardedRef) => {
    const { __scopeStepperItem, ...rest } = props;
    const itemContext = useStepperItemContext(STEPPER_TITLE_NAME, __scopeStepperItem);
    return <Primitive as="span" data-state={itemContext.status} {...rest} ref={forwardedRef} />;
  },
);

StepperTitle.displayName = STEPPER_TITLE_NAME;

export { StepperTitle };
export type { StepperTitleProps };
