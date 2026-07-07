import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useStepperContext } from './stepper-context';
import { StepperItemProvider } from './stepper-item-context';

import type { ScopedProps } from './stepper-context';
import type { ItemScopedProps, StepStatus } from './stepper-item-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const STEPPER_ITEM_NAME = 'StepperItem';

interface StepperItemProps extends PrimitivePropsWithRef<'li'> {
  /** This step's position in the sequence (0-indexed). */
  index: number;
  disabled?: boolean;
}

/**
 * Wraps one step's `StepperTrigger`. Holds no state itself — the current
 * step lives on the `Stepper` root — but derives this item's `status`
 * (`'complete'` if `index < step`, `'current'` if `index === step`,
 * `'upcoming'` otherwise) and mints the item-level context that
 * `StepperTrigger`/`StepperIndicator`/`StepperTitle`/`StepperDescription`
 * read from, so those don't need `index` threaded through their own props
 * (mirrors `AccordionItem`).
 *
 * @example
 * ```tsx
 * <StepperItem index={0}>
 *   <StepperTrigger>
 *     <StepperIndicator>1</StepperIndicator>
 *     <StepperTitle>Account</StepperTitle>
 *   </StepperTrigger>
 * </StepperItem>
 * ```
 */
const StepperItem = React.forwardRef<
  HTMLLIElement,
  ScopedProps<ItemScopedProps<StepperItemProps>>
>((props, forwardedRef) => {
  const {
    __scopeStepper,
    __scopeStepperItem,
    index,
    disabled = false,
    ...itemProps
  } = props;

  const rootContext = useStepperContext(STEPPER_ITEM_NAME, __scopeStepper);
  const status: StepStatus =
    index < rootContext.step ? 'complete' : index === rootContext.step ? 'current' : 'upcoming';

  return (
    <StepperItemProvider
      scope={__scopeStepperItem}
      index={index}
      status={status}
      disabled={disabled}
    >
      <Primitive
        as="li"
        data-state={status}
        data-disabled={disabled ? '' : undefined}
        data-orientation={rootContext.orientation}
        {...itemProps}
        ref={forwardedRef}
      />
    </StepperItemProvider>
  );
});

StepperItem.displayName = STEPPER_ITEM_NAME;

export { StepperItem };
export type { StepperItemProps };
