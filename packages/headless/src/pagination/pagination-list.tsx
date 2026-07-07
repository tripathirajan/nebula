import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type PaginationListProps = PrimitivePropsWithRef<'ul'>;

/**
 * `<ul>` wrapper for {@link PaginationItem}s.
 *
 * @example
 * ```tsx
 * <PaginationList>
 *   <PaginationItem>...</PaginationItem>
 * </PaginationList>
 * ```
 */
const PaginationList = React.forwardRef<HTMLUListElement, PaginationListProps>(
  (props, forwardedRef) => <Primitive as="ul" {...props} ref={forwardedRef} />,
);

PaginationList.displayName = 'PaginationList';

export { PaginationList };
export type { PaginationListProps };
