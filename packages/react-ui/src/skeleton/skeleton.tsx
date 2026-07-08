import { Skeleton as HeadlessSkeleton } from '@nebula/headless/skeleton';
import { cn } from '@nebula/primitives/cn';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { SkeletonProps as HeadlessSkeletonProps } from '@nebula/headless/skeleton';
import type { VariantProps } from 'class-variance-authority';

/**
 * `rectangle` reads `--radius-box` (the same generic-box role `Card` uses)
 * — the previous default. `circle` and `square` used to require overriding
 * `className` by hand (`rounded-full`/`rounded-none`); promoted to a real
 * variant so a shape like the avatar placeholder isn't a one-off className
 * every consumer has to remember.
 */
const skeletonVariants = cva('animate-pulse bg-[var(--skeleton-bg)]', {
  variants: {
    shape: {
      rectangle: 'rounded-[var(--radius-box)]',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
  },
  defaultVariants: { shape: 'rectangle' },
});

type SkeletonProps = HeadlessSkeletonProps & VariantProps<typeof skeletonVariants>;

/**
 * Styled wrapper around `@nebula/headless`'s `Skeleton` — the `aria-hidden`
 * behavior comes from there unchanged. This layer adds the visual shimmer: a
 * muted fill (`--skeleton-bg`) pulsing via Tailwind's built-in
 * `animate-pulse`, plus the `shape` variant (`rectangle` default, `circle`,
 * `square`).
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-32" />
 * <Skeleton shape="circle" className="h-12 w-12" />
 * <Skeleton shape="square" className="h-12 w-12" />
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>((props, forwardedRef) => {
  const { className, shape, ...rest } = props;
  return (
    <HeadlessSkeleton
      className={cn(skeletonVariants({ shape }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export { Skeleton, skeletonVariants };
export type { SkeletonProps };
