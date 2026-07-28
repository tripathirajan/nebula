import { Paragraph as PrimitiveParagraph } from '@nebula-lab/primitives/paragraph';
import * as React from 'react';

import type { ParagraphProps as PrimitiveParagraphProps } from '@nebula-lab/primitives/paragraph';

/**
 * Styled `Paragraph` — thin re-export of `@nebula-lab/primitives`'
 * `Paragraph`, a `p` with comfortable reading line-height by default — for
 * body copy, as distinct from `Text` (no line-height opinion, meant for
 * inline runs).
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
    return <PrimitiveParagraph {...(props as PrimitiveParagraphProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveParagraph;

Paragraph.displayName = 'Paragraph';

export { Paragraph };
export type { PrimitiveParagraphProps as ParagraphProps };
