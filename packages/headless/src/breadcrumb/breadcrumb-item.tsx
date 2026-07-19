
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type BreadcrumbItemProps = PrimitivePropsWithRef<'li'>;

/**
 * `<li>` — one step in the trail, wrapping either a `BreadcrumbLink` (a
 * past/ancestor page) or a `BreadcrumbPage` (the current one).
 *
 * @example
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
 * </BreadcrumbItem>
 * ```
 */
const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (props, forwardedRef) => <Primitive as="li" {...props} ref={forwardedRef} />,
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export { BreadcrumbItem };
export type { BreadcrumbItemProps };
