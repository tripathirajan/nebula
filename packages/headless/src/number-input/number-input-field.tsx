import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Input } from '@nebula-lab/primitives/input';
import * as React from 'react';

import { useNumberInputContext } from './number-input-context';

import type { ScopedProps } from './number-input-context';
import type { InputProps } from '@nebula-lab/primitives/input';

const NUMBER_INPUT_FIELD_NAME = 'NumberInputField';

type NumberInputFieldProps = Omit<InputProps, 'type' | 'value' | 'defaultValue'>;

/**
 * The real `<input type="number">` — `min`/`max`/`step`/`disabled`/`value`
 * all come from `NumberInput`'s context, so they never need to be repeated
 * here.
 *
 * @example
 * ```tsx
 * <NumberInputField aria-label="Quantity" />
 * ```
 */
const NumberInputField = React.forwardRef<HTMLInputElement, ScopedProps<NumberInputFieldProps>>(
  (props, forwardedRef) => {
    const { __scopeNumberInput, id, onChange, ...fieldProps } = props;
    const context = useNumberInputContext(NUMBER_INPUT_FIELD_NAME, __scopeNumberInput);

    return (
      <Input
        type="number"
        id={id ?? context.fieldId}
        value={context.value ?? ''}
        min={context.min}
        max={context.max}
        step={context.step}
        disabled={context.disabled}
        {...fieldProps}
        ref={forwardedRef}
        onChange={composeEventHandlers(onChange, (event) => {
          const raw = event.currentTarget.value;
          context.setValue(raw === '' ? undefined : Number(raw));
        })}
      />
    );
  },
);

NumberInputField.displayName = NUMBER_INPUT_FIELD_NAME;

export { NumberInputField };
export type { NumberInputFieldProps };
