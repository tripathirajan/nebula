
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type BreadcrumbLinkProps = PrimitivePropsWithRef<'a'>;

/**
 * `<a>` — a past/ancestor page in the trail, a real link (not the current
 * page — that's `BreadcrumbPage`, which is deliberately not a link at all).
 * Supports `asChild` (via `Primitive`) to render as a routing library's own
 * link component (e.g. React Router's `Link`, Next.js' `Link`) instead of a
 * plain `<a>`, the same way any other `Primitive`-based component here does.
 *
 * @example
 * ```tsx
 * <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
 *
 * // With a routing library's own Link:
 * <BreadcrumbLink asChild>
 *   <RouterLink to="/settings">Settings</RouterLink>
 * </BreadcrumbLink>
 * ```
 */
const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  (props, forwardedRef) => <Primitive as="a" {...props} ref={forwardedRef} />,
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

export { BreadcrumbLink };
export type { BreadcrumbLinkProps };
