
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type BreadcrumbListProps = PrimitivePropsWithRef<'ol'>;

/**
 * `<ol>` — an ordered list, since a breadcrumb trail has a meaningful
 * sequence (the WAI-ARIA breadcrumb pattern specifically recommends a list,
 * ordered over unordered, for that reason).
 *
 * @example
 * ```tsx
 * <BreadcrumbList>
 *   <BreadcrumbItem>...</BreadcrumbItem>
 * </BreadcrumbList>
 * ```
 */
const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  (props, forwardedRef) => <Primitive as="ol" {...props} ref={forwardedRef} />,
);

BreadcrumbList.displayName = 'BreadcrumbList';

export { BreadcrumbList };
export type { BreadcrumbListProps };
