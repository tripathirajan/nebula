import { Primitive } from '@nebula/primitives/primitive';
import { VisuallyHidden } from '@nebula/primitives/visually-hidden';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type PaginationEllipsisProps = PrimitivePropsWithRef<'span'>;

/**
 * A decorative "…" marker for a run of collapsed page numbers — `aria-hidden`
 * since it's not itself interactive, with a visually-hidden "More pages"
 * label so assistive tech still gets some indication a gap exists.
 *
 * @example
 * ```tsx
 * <PaginationEllipsis />
 * ```
 */
const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  (props, forwardedRef) => {
    const { children, ...rest } = props;
    return (
      <Primitive as="span" aria-hidden="true" {...rest} ref={forwardedRef}>
        {children ?? '…'}
        <VisuallyHidden>More pages</VisuallyHidden>
      </Primitive>
    );
  },
);

PaginationEllipsis.displayName = 'PaginationEllipsis';

export { PaginationEllipsis };
export type { PaginationEllipsisProps };
