
import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Primitive } from '@nebula/primitives/primitive';
import { FocusItem } from '@nebula/primitives/roving-focus-group';
import * as React from 'react';


import { useAccordionContext } from './accordion-context';
import { useAccordionItemContext } from './accordion-item-context';

import type { ScopedProps } from './accordion-context';
import type { ItemScopedProps } from './accordion-item-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const ACCORDION_TRIGGER_NAME = 'AccordionTrigger';

type AccordionTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * `role="button"` (native, via the `button` tag) with `aria-expanded`/
 * `aria-controls` wired to this item's panel. Wrapped in `@nebula/primitives`'
 * `FocusItem` for arrow-key movement between triggers (it finds the ambient
 * `RovingFocusGroup` the `Accordion` root renders, same as `RadioGroupItem` —
 * no manual scope wiring needed) — unlike `RadioGroupItem`, moving focus here
 * does *not* also toggle the panel; only a real click/Enter/Space does,
 * since native `<button>` semantics already give us that for free.
 *
 * @example
 * ```tsx
 * <AccordionTrigger disabled={item.locked}>{item.question}</AccordionTrigger>
 * ```
 */
const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  ScopedProps<ItemScopedProps<AccordionTriggerProps>>
>((props, forwardedRef) => {
  const { __scopeAccordion, __scopeAccordionItem, onClick, disabled: disabledProp, ...triggerProps } =
    props;
  const rootContext = useAccordionContext(ACCORDION_TRIGGER_NAME, __scopeAccordion);
  const itemContext = useAccordionItemContext(ACCORDION_TRIGGER_NAME, __scopeAccordionItem);
  const disabled = disabledProp || itemContext.disabled;

  return (
    <FocusItem asChild focusable={!disabled}>
      <Primitive
        as="button"
        type="button"
        id={itemContext.triggerId}
        aria-expanded={itemContext.open}
        aria-controls={itemContext.contentId}
        data-state={itemContext.open ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        data-orientation={rootContext.orientation}
        disabled={disabled}
        {...triggerProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          rootContext.onItemOpenChange(itemContext.value, !itemContext.open);
        })}
      />
    </FocusItem>
  );
});

AccordionTrigger.displayName = ACCORDION_TRIGGER_NAME;

export { AccordionTrigger };
export type { AccordionTriggerProps };
