import { cn } from '@nebula-lab/primitives/cn';
import { Paragraph as PrimitiveParagraph } from '@nebula-lab/primitives/paragraph';
import * as React from 'react';

import type { ParagraphProps as PrimitiveParagraphProps } from '@nebula-lab/primitives/paragraph';

/**
 * Styled `Paragraph` — the unstyled primitive carries no classes of its own
 * (unstyled primitives own behavior, not visuals), so this layer is the sole
 * source of the comfortable reading line-height — for body copy, as distinct
 * from `Text` (no line-height opinion at any layer, meant for inline runs).
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
    props: PrimitiveParagraphProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { className, ...rest } = props;
    return (
      <PrimitiveParagraph
        {...(rest as PrimitiveParagraphProps<E>)}
        ref={forwardedRef}
        className={cn('leading-relaxed', className)}
      />
    );
  },
) as typeof PrimitiveParagraph;

Paragraph.displayName = 'Paragraph';

export { Paragraph };
export type { PrimitiveParagraphProps as ParagraphProps };
