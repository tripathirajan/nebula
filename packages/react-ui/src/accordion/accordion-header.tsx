import { AccordionHeader as HeadlessAccordionHeader } from '@nebula/headless/accordion';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { AccordionHeaderProps as HeadlessAccordionHeaderProps } from '@nebula/headless/accordion';

type AccordionHeaderProps = HeadlessAccordionHeaderProps;

/** Purely structural (a heading wrapper) — `flex` so `AccordionTrigger`'s chevron can sit at the far end. */
const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessAccordionHeader className={cn('flex', className)} {...rest} ref={forwardedRef} />
    );
  },
);

AccordionHeader.displayName = 'AccordionHeader';

export { AccordionHeader };
export type { AccordionHeaderProps };
