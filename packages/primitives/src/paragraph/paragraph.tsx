import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/** Props accepted by {@link Paragraph}. */
type ParagraphProps<E extends React.ElementType = 'p'> = PolymorphicComponentPropsWithRef<E>;

/**
 * A `p` with comfortable reading line-height by default — for body copy,
 * as distinct from `Text` (no line-height opinion, meant for inline runs).
 *
 * @example
 * ```tsx
 * <Paragraph>
 *   A block of body copy that reads comfortably at paragraph length,
 *   without needing a manually-applied leading-relaxed class every time.
 * </Paragraph>
 * ```
 */
const Paragraph = React.forwardRef(
  <E extends React.ElementType = 'p'>(
    props: ParagraphProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { as, className, ...rest } = props;
    return (
      <Primitive
        as={as ?? ('p' as E)}
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        className={cn('leading-relaxed', className)}
      />
    );
  },
) as PolymorphicComponent<'p'>;

Paragraph.displayName = 'Paragraph';

export { Paragraph };
export type { ParagraphProps };
