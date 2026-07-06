import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type PaginationItemProps = PrimitivePropsWithRef<'li'>;

/**
 * `<li>` wrapper for one {@link PaginationLink}/{@link PaginationEllipsis}/
 * {@link PaginationPrevious}/{@link PaginationNext}.
 *
 * @example
 * ```tsx
 * <PaginationItem><PaginationLink page={3}>3</PaginationLink></PaginationItem>
 * ```
 */
const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  (props, forwardedRef) => <Primitive as="li" {...props} ref={forwardedRef} />,
);

PaginationItem.displayName = 'PaginationItem';

export { PaginationItem };
export type { PaginationItemProps };
