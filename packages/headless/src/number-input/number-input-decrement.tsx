import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useNumberInputContext } from './number-input-context';

import type { ScopedProps } from './number-input-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const NUMBER_INPUT_DECREMENT_NAME = 'NumberInputDecrement';

type NumberInputDecrementProps = PrimitivePropsWithRef<'button'>;

/**
 * Decrements `NumberInput`'s value by `step`, clamped to `min` — disabled
 * automatically once the current value has reached `min`. Always pass an
 * `aria-label` (there's rarely visible text on a plain "-" button).
 *
 * `tabIndex={-1}` is deliberate — see `NumberInputIncrement`'s doc comment.
 *
 * @example
 * ```tsx
 * <NumberInputDecrement aria-label="Decrease">-</NumberInputDecrement>
 * ```
 */
const NumberInputDecrement = React.forwardRef<
  HTMLButtonElement,
  ScopedProps<NumberInputDecrementProps>
>((props, forwardedRef) => {
  const { __scopeNumberInput, onClick, disabled: disabledProp, ...rest } = props;
  const context = useNumberInputContext(NUMBER_INPUT_DECREMENT_NAME, __scopeNumberInput);
  const atMin = context.min !== undefined && (context.value ?? 0) <= context.min;
  const disabled = disabledProp || context.disabled || atMin;

  return (
    <Primitive
      as="button"
      type="button"
      aria-controls={context.fieldId}
      tabIndex={-1}
      disabled={disabled}
      {...rest}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => context.decrement())}
    />
  );
});

NumberInputDecrement.displayName = NUMBER_INPUT_DECREMENT_NAME;

export { NumberInputDecrement };
export type { NumberInputDecrementProps };
