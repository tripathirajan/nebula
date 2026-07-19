
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useAccordionItemContext } from './accordion-item-context';

import type { ItemScopedProps } from './accordion-item-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const ACCORDION_HEADER_NAME = 'AccordionHeader';

type AccordionHeaderProps = PrimitivePropsWithRef<'h3'>;

/**
 * Wraps `AccordionTrigger` in a heading, per the WAI-ARIA Accordion pattern
 * ("the title of each accordion header is contained in an element with role
 * `heading`"). Renders `h3` by default — use `asChild` to render a different
 * heading level (`<AccordionHeader asChild><h2><AccordionTrigger>...</h2></AccordionHeader>`)
 * so the document outline matches the page's actual heading hierarchy,
 * matching how every other fixed-tag component in this package handles tag
 * flexibility.
 *
 * @example
 * ```tsx
 * <AccordionHeader>
 *   <AccordionTrigger>What is nebula?</AccordionTrigger>
 * </AccordionHeader>
 * ```
 */
const AccordionHeader = React.forwardRef<HTMLHeadingElement, ItemScopedProps<AccordionHeaderProps>>(
  (props, forwardedRef) => {
    const { __scopeAccordionItem, ...headerProps } = props;
    const itemContext = useAccordionItemContext(ACCORDION_HEADER_NAME, __scopeAccordionItem);

    return (
      <Primitive
        as="h3"
        data-state={itemContext.open ? 'open' : 'closed'}
        data-disabled={itemContext.disabled ? '' : undefined}
        {...headerProps}
        ref={forwardedRef}
      />
    );
  },
);

AccordionHeader.displayName = ACCORDION_HEADER_NAME;

export { AccordionHeader };
export type { AccordionHeaderProps };
