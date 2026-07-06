import { cn } from '@nebula/primitives/cn';
import { AccordionItem as StylelessAccordionItem } from '@nebula/styleless/accordion';
import * as React from 'react';

import type { AccordionItemProps as StylelessAccordionItemProps } from '@nebula/styleless/accordion';

type AccordionItemProps = StylelessAccordionItemProps;

/** Adds the border between items — see `../tokens/component.ts`'s `accordionTokens`. */
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessAccordionItem
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
