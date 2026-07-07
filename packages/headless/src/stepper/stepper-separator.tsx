import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useStepperContext } from './stepper-context';

import type { ScopedProps } from './stepper-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const STEPPER_SEPARATOR_NAME = 'StepperSeparator';

type StepperSeparatorProps = PrimitivePropsWithRef<'span'>;

/**
 * A decorative connecting line between two `StepperItem`s — `aria-hidden`
 * since it carries no information beyond what the items' order already
 * conveys (mirrors `BreadcrumbSeparator`/`PaginationEllipsis`). Placed by the
 * consumer directly between `StepperItem`s, not auto-inserted.
 *
 * @example
 * ```tsx
 * <StepperItem index={0}>...</StepperItem>
 * <StepperSeparator />
 * <StepperItem index={1}>...</StepperItem>
 * ```
 */
const StepperSeparator = React.forwardRef<HTMLSpanElement, ScopedProps<StepperSeparatorProps>>(
  (props, forwardedRef) => {
    const { __scopeStepper, ...rest } = props;
    const context = useStepperContext(STEPPER_SEPARATOR_NAME, __scopeStepper);
    return (
      <Primitive
        as="span"
        aria-hidden="true"
        data-orientation={context.orientation}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperSeparator.displayName = STEPPER_SEPARATOR_NAME;

export { StepperSeparator };
export type { StepperSeparatorProps };
