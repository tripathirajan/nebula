import { AccordionItem as HeadlessAccordionItem } from '@nebula/headless/accordion';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { AccordionItemProps as HeadlessAccordionItemProps } from '@nebula/headless/accordion';

type AccordionItemProps = HeadlessAccordionItemProps;

/** Adds the border between items — see `../tokens/component.ts`'s `accordionTokens`. */
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessAccordionItem
        className={cn('border-b border-[var(--accordion-border)] last:border-b-0', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export { AccordionItem };
export type { AccordionItemProps };
