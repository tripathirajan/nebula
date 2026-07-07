import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';
import type { RovingFocusGroupOrientation } from '@nebula/primitives/roving-focus-group';

interface AccordionContextValue {
  /** True if `value` (an item's identifying value) is currently expanded — abstracts over the `single`/`multiple` value-shape difference so `AccordionItem`/`AccordionTrigger` never need to know which `type` the root is. */
  isItemOpen: (value: string) => boolean;
  /** Toggle `value` open/closed. For `type="single"` this also closes whichever other item was open; for `type="multiple"` it only touches this one item. */
  onItemOpenChange: (value: string, open: boolean) => void;
  disabled: boolean;
  orientation: RovingFocusGroupOrientation;
  baseId: string;
}

const ACCORDION_NAME = 'Accordion';

/**
 * Scoped context factory for the Accordion root — mirrors `Tabs`/`RadioGroup`'s
 * use of `createContextScope` so a nested `Accordion` (e.g. sub-items inside
 * a panel) mints its own context instead of colliding with the outer one.
 */
const [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME);
const [AccordionProvider, useAccordionContext] =
  createAccordionContext<AccordionContextValue>(ACCORDION_NAME);

/** Every consumer prop object accepts an optional internal `__scopeAccordion` prop threaded through by `createAccordionScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeAccordion?: Scope<AccordionContextValue> };

/**
 * Derives a stable, unique `id` for the trigger button controlling `itemValue`.
 *
 * @example
 * ```ts
 * makeTriggerId('nebula-accordion-1', 'faq-1'); // 'nebula-accordion-1-trigger-faq-1'
 * ```
 */
function makeTriggerId(baseId: string, itemValue: string): string {
  return `${baseId}-trigger-${itemValue}`;
}

/**
 * Derives a stable, unique `id` for the content panel corresponding to `itemValue`.
 *
 * @example
 * ```ts
 * makeContentId('nebula-accordion-1', 'faq-1'); // 'nebula-accordion-1-content-faq-1'
 * ```
 */
function makeContentId(baseId: string, itemValue: string): string {
  return `${baseId}-content-${itemValue}`;
}

export {
  ACCORDION_NAME,
  AccordionProvider,
  useAccordionContext,
  createAccordionScope,
  makeTriggerId,
  makeContentId,
};
export type { AccordionContextValue, ScopedProps };
