import { cn } from '@nebula/primitives/cn';
import { AccordionHeader as StylelessAccordionHeader } from '@nebula/styleless/accordion';
import * as React from 'react';

import type { AccordionHeaderProps as StylelessAccordionHeaderProps } from '@nebula/styleless/accordion';

type AccordionHeaderProps = StylelessAccordionHeaderProps;

/** Purely structural (a heading wrapper) — `flex` so `AccordionTrigger`'s chevron can sit at the far end. */
const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessAccordionHeader className={cn('flex', className)} {...rest} ref={forwardedRef} />
    );
  },
);

AccordionHeader.displayName = 'AccordionHeader';

export { AccordionHeader };
export type { AccordionHeaderProps };
