import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useNumberInputContext } from './number-input-context';

import type { ScopedProps } from './number-input-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const NUMBER_INPUT_INCREMENT_NAME = 'NumberInputIncrement';

type NumberInputIncrementProps = PrimitivePropsWithRef<'button'>;

/**
 * Increments `NumberInput`'s value by `step`, clamped to `max` — disabled
 * automatically once the current value has reached `max`. Always pass an
 * `aria-label` (there's rarely visible text on a plain "+" button).
 *
 * `tabIndex={-1}` is deliberate: `NumberInputField`'s native
 * `<input type="number">` already exposes equivalent up/down-arrow-key
 * increment while focused, so this button is an additional mouse/touch
 * affordance, not the only way to reach this functionality from a keyboard
 * — leaving it out of the tab sequence avoids an extra, redundant stop for
 * keyboard users (same rationale mainstream number-input implementations
 * use for their stepper buttons).
 *
 * @example
 * ```tsx
 * <NumberInputIncrement aria-label="Increase">+</NumberInputIncrement>
 * ```
 */
const NumberInputIncrement = React.forwardRef<
  HTMLButtonElement,
  ScopedProps<NumberInputIncrementProps>
>((props, forwardedRef) => {
  const { __scopeNumberInput, onClick, disabled: disabledProp, ...rest } = props;
  const context = useNumberInputContext(NUMBER_INPUT_INCREMENT_NAME, __scopeNumberInput);
  const atMax = context.max !== undefined && (context.value ?? 0) >= context.max;
  const disabled = disabledProp || context.disabled || atMax;

  return (
    <Primitive
      as="button"
      type="button"
      aria-controls={context.fieldId}
      tabIndex={-1}
      disabled={disabled}
      {...rest}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => context.increment())}
    />
  );
});

NumberInputIncrement.displayName = NUMBER_INPUT_INCREMENT_NAME;

export { NumberInputIncrement };
export type { NumberInputIncrementProps };
