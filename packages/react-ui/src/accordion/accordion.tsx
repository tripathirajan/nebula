import { Accordion as HeadlessAccordion } from '@nebula/headless/accordion';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { AccordionProps as HeadlessAccordionProps } from '@nebula/headless/accordion';

type AccordionProps = HeadlessAccordionProps;

/**
 * Styled wrapper around `@nebula/headless`'s `Accordion` — all ARIA/keyboard
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
    <HeadlessAccordion className={cn('flex flex-col', className)} {...rest} ref={forwardedRef} />
  );
});

Accordion.displayName = 'Accordion';

export { Accordion };
export type { AccordionProps };
