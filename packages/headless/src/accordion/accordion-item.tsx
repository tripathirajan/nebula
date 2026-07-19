
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { makeContentId, makeTriggerId, useAccordionContext } from './accordion-context';
import { AccordionItemProvider } from './accordion-item-context';

import type { ScopedProps } from './accordion-context';
import type { ItemScopedProps } from './accordion-item-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const ACCORDION_ITEM_NAME = 'AccordionItem';

interface AccordionItemProps extends PrimitivePropsWithRef<'div'> {
  /** Identifies this item within its `Accordion` — must be unique within the group. */
  value: string;
  disabled?: boolean;
}

/**
 * Wraps one header+content pair. Holds no open/closed state itself — that
 * lives on the `Accordion` root, keyed by `value` — but mints the item-level
 * context (`accordion-item-context.ts`) that `AccordionHeader`/
 * `AccordionTrigger`/`AccordionContent` read from, so those three don't need
 * `value` threaded through their own props.
 *
 * @example
 * ```tsx
 * <AccordionItem value="item-1">
 *   <AccordionHeader><AccordionTrigger>Question</AccordionTrigger></AccordionHeader>
 *   <AccordionContent>Answer.</AccordionContent>
 * </AccordionItem>
 * ```
 */
const AccordionItem = React.forwardRef<
  HTMLDivElement,
  ScopedProps<ItemScopedProps<AccordionItemProps>>
>((props, forwardedRef) => {
  const {
    __scopeAccordion,
    __scopeAccordionItem,
    value,
    disabled: disabledProp = false,
    ...itemProps
  } = props;

  const rootContext = useAccordionContext(ACCORDION_ITEM_NAME, __scopeAccordion);
  const open = rootContext.isItemOpen(value);
  const disabled = disabledProp || rootContext.disabled;

  return (
    <AccordionItemProvider
      scope={__scopeAccordionItem}
      value={value}
      open={open}
      disabled={disabled}
      triggerId={makeTriggerId(rootContext.baseId, value)}
      contentId={makeContentId(rootContext.baseId, value)}
    >
      <Primitive
        as="div"
        data-state={open ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        data-orientation={rootContext.orientation}
        {...itemProps}
        ref={forwardedRef}
      />
    </AccordionItemProvider>
  );
});

AccordionItem.displayName = ACCORDION_ITEM_NAME;

export { AccordionItem };
export type { AccordionItemProps };
