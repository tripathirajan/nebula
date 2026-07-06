import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useStepperItemContext } from './stepper-item-context';

import type { ItemScopedProps } from './stepper-item-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const STEPPER_INDICATOR_NAME = 'StepperIndicator';

type StepperIndicatorProps = PrimitivePropsWithRef<'span'>;

/**
 * Decorative slot for a step's number/checkmark/icon — `aria-hidden` since
 * `StepperTitle`'s visible text (rendered alongside it inside
 * `StepperTrigger`) already provides the accessible name (mirrors
 * `CardHeader`'s `icon` slot). Exposes `data-state` so consumers can swap in
 * a checkmark icon for `'complete'` versus a plain number for
 * `'current'`/`'upcoming'` via CSS or conditional children.
 *
 * @example
 * ```tsx
 * <StepperIndicator>{status === 'complete' ? <CheckIcon /> : 1}</StepperIndicator>
 * ```
 */
const StepperIndicator = React.forwardRef<HTMLSpanElement, ItemScopedProps<StepperIndicatorProps>>(
  (props, forwardedRef) => {
    const { __scopeStepperItem, ...rest } = props;
    const itemContext = useStepperItemContext(STEPPER_INDICATOR_NAME, __scopeStepperItem);
    return (
      <Primitive
        as="span"
        aria-hidden="true"
        data-state={itemContext.status}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperIndicator.displayName = STEPPER_INDICATOR_NAME;

export { StepperIndicator };
export type { StepperIndicatorProps };
