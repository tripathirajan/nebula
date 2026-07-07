import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface AccordionItemContextValue {
  /** This item's identifying value — needed by `AccordionTrigger` to call the root's `onItemOpenChange(value, ...)`. */
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const ACCORDION_ITEM_NAME = 'AccordionItem';

/**
 * Separate scope from `accordion-context.ts`'s root scope — `AccordionHeader`/
 * `AccordionTrigger`/`AccordionContent` need per-item state (this item's own
 * `open`/`disabled`/ids) that has nothing to do with the root's `type`/value
 * bookkeeping, so it's a distinct context rather than overloading one context
 * with two unrelated concerns.
 */
const [createAccordionItemContext, createAccordionItemScope] =
  createContextScope(ACCORDION_ITEM_NAME);
const [AccordionItemProvider, useAccordionItemContext] =
  createAccordionItemContext<AccordionItemContextValue>(ACCORDION_ITEM_NAME);

/** Every consumer prop object accepts an optional internal `__scopeAccordionItem` prop threaded through by `createAccordionItemScope` — not part of the public API. */
type ItemScopedProps<P> = P & { __scopeAccordionItem?: Scope<AccordionItemContextValue> };

export {
  ACCORDION_ITEM_NAME,
  AccordionItemProvider,
  useAccordionItemContext,
  createAccordionItemScope,
};
export type { AccordionItemContextValue, ItemScopedProps };
