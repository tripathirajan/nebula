import { AccordionContent as HeadlessAccordionContent } from '@nebula/headless/accordion';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { AccordionContentProps as HeadlessAccordionContentProps } from '@nebula/headless/accordion';

type AccordionContentProps = HeadlessAccordionContentProps;

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessAccordionContent
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
