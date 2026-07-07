import { Skeleton as HeadlessSkeleton } from '@nebula/headless/skeleton';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { SkeletonProps as HeadlessSkeletonProps } from '@nebula/headless/skeleton';

type SkeletonProps = HeadlessSkeletonProps;

/**
 * Styled wrapper around `@nebula/headless`'s `Skeleton` — the `aria-hidden`
 * behavior comes from there unchanged. This layer adds the visual shimmer: a
 * muted fill (`--skeleton-bg`) pulsing via Tailwind's built-in
 * `animate-pulse`, plus a default box radius (`--radius-box`, the same
 * generic-box role `Card` uses) — override with your own `className` (e.g.
 * `rounded-full`) for an avatar-shaped placeholder.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-32" />
 * <Skeleton className="h-12 w-12 rounded-full" />
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessSkeleton
      className={cn('animate-pulse rounded-[var(--radius-box)] bg-[var(--skeleton-bg)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps };
