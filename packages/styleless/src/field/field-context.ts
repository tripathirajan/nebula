import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface FieldContextValue {
  id: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const FIELD_NAME = 'Field';

/**
 * Scoped context factory for Field — mirrors every other compound
 * component's use of `createContextScope` so a `Field` nested inside another
 * one (e.g. a composite field made of two sub-fields) mints its own context
 * instead of colliding with an outer one.
 */
const [createFieldContext, createFieldScope] = createContextScope(FIELD_NAME);
const [FieldProvider, useFieldContext] = createFieldContext<FieldContextValue>(FIELD_NAME);

/** Every consumer prop object accepts an optional internal `__scopeField` prop threaded through by `createFieldScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeField?: Scope<FieldContextValue> };

export { FIELD_NAME, FieldProvider, useFieldContext, createFieldScope };
export type { FieldContextValue, ScopedProps };
