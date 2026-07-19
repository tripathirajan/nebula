import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useStepperContext } from './stepper-context';

import type { ScopedProps } from './stepper-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const STEPPER_LIST_NAME = 'StepperList';

type StepperListProps = PrimitivePropsWithRef<'ol'>;

/**
 * `<ol>` wrapper for `StepperItem`s — ordered since a stepper's sequence is
 * meaningful (step 2 genuinely comes after step 1), unlike `PaginationList`'s
 * `<ul>` where page links have no inherent order relationship beyond number.
 *
 * @example
 * ```tsx
 * <StepperList>
 *   <StepperItem index={0}>...</StepperItem>
 * </StepperList>
 * ```
 */
const StepperList = React.forwardRef<HTMLOListElement, ScopedProps<StepperListProps>>(
  (props, forwardedRef) => {
    const { __scopeStepper, ...rest } = props;
    const context = useStepperContext(STEPPER_LIST_NAME, __scopeStepper);
    return (
      <Primitive as="ol" data-orientation={context.orientation} {...rest} ref={forwardedRef} />
    );
  },
);

StepperList.displayName = STEPPER_LIST_NAME;

export { StepperList };
export type { StepperListProps };
