import { cn } from '@nebula/primitives/cn';
import { AccordionContent as StylelessAccordionContent } from '@nebula/styleless/accordion';
import * as React from 'react';

import type { AccordionContentProps as StylelessAccordionContentProps } from '@nebula/styleless/accordion';

type AccordionContentProps = StylelessAccordionContentProps;

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessAccordionContent
        className={cn('pb-4 text-sm text-[var(--accordion-text)]/80', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

AccordionContent.displayName = 'AccordionContent';

export { AccordionContent };
export type { AccordionContentProps };
