
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type SkeletonProps = PrimitivePropsWithRef<'div'>;

/**
 * A loading placeholder shape — `aria-hidden` by default, since a skeleton
 * bone is a decorative stand-in for content that hasn't arrived yet, not
 * something a screen reader user benefits from having announced
 * individually (a page with a dozen skeleton bones shouldn't announce a
 * dozen "loading" statuses). Wrap a group of them in a single container with
 * `role="status"` (e.g. `Spinner`, or a plain `<div role="status">`) if the
 * loading state itself needs to be announced once.
 *
 * Renders no visual shimmer/pulse itself — that's `react-ui`'s job (an
 * animated background gradient via CSS); this only wires up the
 * `aria-hidden` contract every skeleton placeholder needs.
 *
 * @example
 * ```tsx
 * <div role="status" aria-label="Loading profile">
 *   <Skeleton className="h-12 w-12 rounded-full" />
 *   <Skeleton className="h-4 w-32" />
 * </div>
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>((props, forwardedRef) => {
  const { 'aria-hidden': ariaHidden = true, ...skeletonProps } = props;

  return <Primitive as="div" aria-hidden={ariaHidden} {...skeletonProps} ref={forwardedRef} />;
});

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps };
