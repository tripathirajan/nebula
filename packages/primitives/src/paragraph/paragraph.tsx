import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/** Props accepted by {@link Paragraph}. */
type ParagraphProps<E extends React.ElementType = 'p'> = PolymorphicComponentPropsWithRef<E>;

/**
 * A `p` by another name, no classes of its own (unstyled primitives own
 * behavior, not visuals — `@nebula-lab/react-ui`'s `Paragraph` supplies the
 * comfortable-reading line-height), distinct from `Text` (meant for inline
 * runs, no line-height opinion at any layer).
 *
 * @example
 * ```tsx
 * <Paragraph>
 *   A block of body copy — reach for @nebula-lab/react-ui's Paragraph for
 *   the comfortable-reading line-height; this unstyled layer adds none.
 * </Paragraph>
 * ```
 */
const Paragraph = React.forwardRef(
  <E extends React.ElementType = 'p'>(
    props: ParagraphProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { as, ...rest } = props;
    return <Primitive as={as ?? ('p' as E)} {...(rest as PrimitiveProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'p'>;

Paragraph.displayName = 'Paragraph';

export { Paragraph };
export type { ParagraphProps };
