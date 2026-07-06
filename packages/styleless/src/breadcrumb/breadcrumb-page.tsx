
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type BreadcrumbPageProps = PrimitivePropsWithRef<'span'>;

/**
 * `<span role="link" aria-disabled="true" aria-current="page">` — the
 * current page in the trail. Renders a `<span>`, not an `<a>` (there'd be
 * nowhere useful for a real link to navigate — it's where the user already
 * is), but keeps `role="link"` so assistive tech still recognizes it as the
 * same kind of trail item as its sibling `BreadcrumbLink`s, with
 * `aria-disabled="true"` marking it non-interactive and `aria-current="page"`
 * identifying which step in the trail this is — per the WAI-ARIA breadcrumb
 * pattern.
 *
 * @example
 * ```tsx
 * <BreadcrumbPage>Profile</BreadcrumbPage>
 * ```
 */
const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  (props, forwardedRef) => (
    <Primitive
      as="span"
      role="link"
      aria-current="page"
      aria-disabled="true"
      {...props}
      ref={forwardedRef}
    />
  ),
);

BreadcrumbPage.displayName = 'BreadcrumbPage';

export { BreadcrumbPage };
export type { BreadcrumbPageProps };
