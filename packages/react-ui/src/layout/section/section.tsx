import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type SectionProps = PrimitivePropsWithRef<'section'>;

/**
 * A `<section>` landmark for one distinct region of page content — vertical
 * spacing between its own children only (`space-y-4`), no background/border
 * of its own, same "neutral content region" treatment `Main` uses. Nest
 * inside `Main` to break a page up into labeled regions (pair with an
 * `aria-label`/`aria-labelledby` when the section's purpose isn't already
 * obvious from a visible heading inside it).
 *
 * @example
 * ```tsx
 * <Section aria-labelledby="billing-heading">
 *   <h2 id="billing-heading">Billing</h2>
 *   ...
 * </Section>
 * ```
 */
const Section = React.forwardRef<HTMLElement, SectionProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive as="section" className={cn('space-y-4', className)} {...rest} ref={forwardedRef} />
  );
});

Section.displayName = 'Section';

export { Section };
export type { SectionProps };
