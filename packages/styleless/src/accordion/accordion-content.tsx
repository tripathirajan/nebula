
import { Presence } from '@nebula/primitives/presence';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import { useAccordionItemContext } from './accordion-item-context';

import type { ItemScopedProps } from './accordion-item-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const ACCORDION_CONTENT_NAME = 'AccordionContent';

interface AccordionContentProps extends PrimitivePropsWithRef<'div'> {
  /**
   * Keep the panel mounted (but `hidden`) while collapsed instead of
   * unmounting it — same escape hatch as `TabPanel`'s `forceMount`, useful
   * to preserve panel-local state across expand/collapse.
   * @default false
   */
  forceMount?: boolean;
}

/**
 * `role="region"`, labelled by its `AccordionTrigger`. Wrapped in
 * `@nebula/primitives`' `Presence` (not a plain unmount like `TabPanel`)
 * because accordion panels are the canonical case for an expand/collapse
 * *animation* — `Presence` keeps this mounted through a CSS transition
 * instead of vanishing the instant `open` flips to `false`; consumers gate
 * the animation itself off `data-state="open"|"closed"` in their CSS.
 *
 * @example
 * ```tsx
 * <AccordionContent className="data-[state=open]:animate-in data-[state=closed]:animate-out">
 *   Answer text.
 * </AccordionContent>
 * ```
 */
const AccordionContent = React.forwardRef<
  HTMLDivElement,
  ItemScopedProps<AccordionContentProps>
>((props, forwardedRef) => {
  const { __scopeAccordionItem, forceMount = false, ...contentProps } = props;
  const itemContext = useAccordionItemContext(ACCORDION_CONTENT_NAME, __scopeAccordionItem);

  return (
    <Presence present={forceMount || itemContext.open}>
      <Primitive
        as="div"
        role="region"
        id={itemContext.contentId}
        aria-labelledby={itemContext.triggerId}
        data-state={itemContext.open ? 'open' : 'closed'}
        data-disabled={itemContext.disabled ? '' : undefined}
        hidden={!itemContext.open}
        {...contentProps}
        ref={forwardedRef}
      />
    </Presence>
  );
});

AccordionContent.displayName = ACCORDION_CONTENT_NAME;

export { AccordionContent };
export type { AccordionContentProps };
