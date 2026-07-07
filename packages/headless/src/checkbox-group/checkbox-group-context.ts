import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface CheckboxGroupContextValue {
  isItemChecked: (value: string) => boolean;
  onItemCheckedChange: (value: string, checked: boolean) => void;
  disabled: boolean;
  name: string | undefined;
}

const CHECKBOX_GROUP_NAME = 'CheckboxGroup';

/**
 * Scoped context factory for CheckboxGroup — mirrors `RadioGroup`/
 * `ToggleGroup`'s use of `createContextScope` so a nested `CheckboxGroup`
 * mints its own context instead of colliding with an outer one.
 */
const [createCheckboxGroupContext, createCheckboxGroupScope] =
  createContextScope(CHECKBOX_GROUP_NAME);
const [CheckboxGroupProvider, useCheckboxGroupContext] =
  createCheckboxGroupContext<CheckboxGroupContextValue>(CHECKBOX_GROUP_NAME);

/** Every consumer prop object accepts an optional internal `__scopeCheckboxGroup` prop threaded through by `createCheckboxGroupScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeCheckboxGroup?: Scope<CheckboxGroupContextValue> };

export {
  CHECKBOX_GROUP_NAME,
  CheckboxGroupProvider,
  useCheckboxGroupContext,
  createCheckboxGroupScope,
};
export type { CheckboxGroupContextValue, ScopedProps };
