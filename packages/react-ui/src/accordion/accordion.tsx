import { cn } from '@nebula/primitives/cn';
import { Accordion as StylelessAccordion } from '@nebula/styleless/accordion';
import * as React from 'react';

import type { AccordionProps as StylelessAccordionProps } from '@nebula/styleless/accordion';

type AccordionProps = StylelessAccordionProps;

/**
 * Styled wrapper around `@nebula/styleless`'s `Accordion` — all ARIA/keyboard
 * behavior (single/multiple, roving-tabindex, `collapsible`) comes from
 * there unchanged; this layer only adds visual styling, per `ui`'s job
 * description in `component-library-architecture.md` §2. The root itself
 * has no visual chrome of its own (a plain `flex flex-col` stack) — the
 * border between items lives on `AccordionItem`.
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionHeader>
 *       <AccordionTrigger>What is nebula?</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionContent>A composable React UI platform.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessAccordion className={cn('flex flex-col', className)} {...rest} ref={forwardedRef} />
  );
});

Accordion.displayName = 'Accordion';

export { Accordion };
export type { AccordionProps };
