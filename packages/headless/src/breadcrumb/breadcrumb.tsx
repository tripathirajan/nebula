
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type BreadcrumbProps = PrimitivePropsWithRef<'nav'>;

/**
 * `<nav aria-label="breadcrumb">` — the WAI-ARIA breadcrumb pattern's
 * landmark wrapper. No state of its own; `BreadcrumbList`/`BreadcrumbItem`/
 * `BreadcrumbLink`/`BreadcrumbPage`/`BreadcrumbSeparator` underneath are
 * purely structural too — a breadcrumb trail's entire accessibility
 * contract is correct markup (a `nav` landmark, an ordered list, the current
 * page marked `aria-current="page"`), not a state machine, unlike most of
 * this package's other components.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Profile</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>((props, forwardedRef) => {
  const { 'aria-label': ariaLabel = 'breadcrumb', ...rest } = props;
  return <Primitive as="nav" aria-label={ariaLabel} {...rest} ref={forwardedRef} />;
});

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
export type { BreadcrumbProps };
