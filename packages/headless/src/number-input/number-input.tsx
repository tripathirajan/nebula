import { useControllableState, useId } from '@nebula-lab/hooks';
import * as React from 'react';

import { NumberInputProvider } from './number-input-context';

import type { ScopedProps } from './number-input-context';

interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  /** @default 1 */
  step?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

function clamp(value: number, min: number | undefined, max: number | undefined) {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

/**
 * Root of the NumberInput compound component. Deliberately built around a
 * real `<input type="number">` (see `NumberInputField`) rather than a
 * custom `role="spinbutton"` element — a native number input already gets
 * correct spinbutton semantics, native up/down-arrow-key increment, and
 * mobile numeric keypads for free, so there's nothing a custom
 * implementation would add here (unlike e.g. `Select`, where the native
 * element genuinely can't do what's needed). `NumberInputIncrement`/
 * `NumberInputDecrement` are an additional, optional mouse/touch affordance
 * on top of that native behavior, not a replacement for it.
 *
 * @example
 * ```tsx
 * <NumberInput defaultValue={1} min={0} max={10}>
 *   <NumberInputDecrement aria-label="Decrease">-</NumberInputDecrement>
 *   <NumberInputField aria-label="Quantity" />
 *   <NumberInputIncrement aria-label="Increase">+</NumberInputIncrement>
 * </NumberInput>
 * ```
 */
function NumberInput(props: ScopedProps<NumberInputProps>) {
  const {
    __scopeNumberInput,
    value: valueProp,
    defaultValue,
    onValueChange,
    min,
    max,
    step = 1,
    disabled = false,
    children,
  } = props;

  const [value, setValue] = useControllableState<number | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const fieldId = useId('nebula-number-input');

  return (
    <NumberInputProvider
      scope={__scopeNumberInput}
      value={value}
      setValue={(next) => setValue(next === undefined ? undefined : clamp(next, min, max))}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      fieldId={fieldId}
      increment={() => setValue(clamp((value ?? min ?? 0) + step, min, max))}
      decrement={() => setValue(clamp((value ?? min ?? 0) - step, min, max))}
    >
      {children}
    </NumberInputProvider>
  );
}

export { NumberInput };
export type { NumberInputProps };
