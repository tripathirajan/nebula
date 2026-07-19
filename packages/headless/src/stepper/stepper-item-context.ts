import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

type StepStatus = 'complete' | 'current' | 'upcoming';

interface StepperItemContextValue {
  index: number;
  status: StepStatus;
  disabled: boolean;
}

const STEPPER_ITEM_NAME = 'StepperItem';

/**
 * Separate scope from `stepper-context.ts`'s root scope — `StepperTrigger`/
 * `StepperIndicator`/`StepperTitle`/`StepperDescription` need per-item state
 * (this item's own `index`/derived `status`) that has nothing to do with the
 * root's `step`/`orientation` bookkeeping, so it's a distinct context rather
 * than overloading one context with two unrelated concerns (mirrors
 * `accordion-item-context.ts`).
 */
const [createStepperItemContext, createStepperItemScope] =
  createContextScope(STEPPER_ITEM_NAME);
const [StepperItemProvider, useStepperItemContext] =
  createStepperItemContext<StepperItemContextValue>(STEPPER_ITEM_NAME);

/** Every consumer prop object accepts an optional internal `__scopeStepperItem` prop threaded through by `createStepperItemScope` — not part of the public API. */
type ItemScopedProps<P> = P & { __scopeStepperItem?: Scope<StepperItemContextValue> };

export {
  STEPPER_ITEM_NAME,
  StepperItemProvider,
  useStepperItemContext,
  createStepperItemScope,
};
export type { StepperItemContextValue, StepStatus, ItemScopedProps };
