import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface NumberInputContextValue {
  value: number | undefined;
  setValue: (value: number | undefined) => void;
  min: number | undefined;
  max: number | undefined;
  step: number;
  disabled: boolean;
  fieldId: string;
  increment: () => void;
  decrement: () => void;
}

const NUMBER_INPUT_NAME = 'NumberInput';

/**
 * Scoped context factory for NumberInput — mirrors every other compound
 * component's use of `createContextScope`.
 */
const [createNumberInputContext, createNumberInputScope] = createContextScope(NUMBER_INPUT_NAME);
const [NumberInputProvider, useNumberInputContext] =
  createNumberInputContext<NumberInputContextValue>(NUMBER_INPUT_NAME);

/** Every consumer prop object accepts an optional internal `__scopeNumberInput` prop threaded through by `createNumberInputScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeNumberInput?: Scope<NumberInputContextValue> };

export {
  NUMBER_INPUT_NAME,
  NumberInputProvider,
  useNumberInputContext,
  createNumberInputScope,
};
export type { NumberInputContextValue, ScopedProps };
