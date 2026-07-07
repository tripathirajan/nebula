import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

type ProgressState = 'indeterminate' | 'loading' | 'complete';

interface ProgressContextValue {
  value: number | null;
  max: number;
  state: ProgressState;
}

const PROGRESS_NAME = 'Progress';

/**
 * Scoped context factory for Progress — same `createContextScope` pattern
 * as every other root+subpart compound here (`Tabs`, `RadioGroup`, ...), so
 * a `Progress` nested inside another one mints its own context rather than
 * colliding with an outer one's `ProgressIndicator`.
 */
const [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME);
const [ProgressProvider, useProgressContext] =
  createProgressContext<ProgressContextValue>(PROGRESS_NAME);

/** Every `Progress`/`ProgressIndicator` prop object accepts an internal `__scopeProgress`, threaded through by `createProgressScope`. */
type ScopedProps<P> = P & { __scopeProgress?: Scope<ProgressContextValue> };

export { PROGRESS_NAME, ProgressProvider, useProgressContext, createProgressScope };
export type { ProgressContextValue, ProgressState, ScopedProps };
