
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type BreadcrumbSeparatorProps = PrimitivePropsWithRef<'li'>;

/**
 * `<li role="presentation" aria-hidden="true">` — the visual divider between
 * two `BreadcrumbItem`s (a "/" or a chevron icon, supplied via `children`;
 * this component renders none by default). Marked `role="presentation"` +
 * `aria-hidden` since it carries no semantic meaning of its own — the
 * `BreadcrumbList`'s own list-item order already conveys the trail's
 * sequence to assistive tech, so the separator is purely decorative, per the
 * WAI-ARIA breadcrumb pattern's own recommendation.
 *
 * @example
 * ```tsx
 * <BreadcrumbSeparator>/</BreadcrumbSeparator>
 * ```
 */
const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  (props, forwardedRef) => (
    <Primitive as="li" role="presentation" aria-hidden="true" {...props} ref={forwardedRef} />
  ),
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export { BreadcrumbSeparator };
export type { BreadcrumbSeparatorProps };
