import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface RadioGroupContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  name: string | undefined;
  required: boolean;
}

const RADIO_GROUP_NAME = 'RadioGroup';

/**
 * Scoped context factory for RadioGroup — mirrors `Tabs`' use of
 * `createContextScope` so a `RadioGroup` nested inside another one (unusual,
 * but not disallowed) mints its own context instead of colliding.
 */
const [createRadioGroupContext, createRadioGroupScope] = createContextScope(RADIO_GROUP_NAME);
const [RadioGroupProvider, useRadioGroupContext] =
  createRadioGroupContext<RadioGroupContextValue>(RADIO_GROUP_NAME);

/** Every consumer prop object accepts an optional internal `__scopeRadioGroup` prop threaded through by `createRadioGroupScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeRadioGroup?: Scope<RadioGroupContextValue> };

export { RADIO_GROUP_NAME, RadioGroupProvider, useRadioGroupContext, createRadioGroupScope };
export type { RadioGroupContextValue, ScopedProps };
