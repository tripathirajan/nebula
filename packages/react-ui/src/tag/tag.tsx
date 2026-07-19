import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { badgeVariants } from '../badge/badge';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';
import type { VariantProps } from 'class-variance-authority';

interface TagProps extends Omit<PrimitivePropsWithRef<'span'>, 'color'> {
  /** Same eight semantic color roles `Badge` exposes. @default 'neutral' */
  color?: VariantProps<typeof badgeVariants>['color'];
}

/**
 * A non-interactive category/keyword label — reuses `Badge`'s own
 * `badgeVariants` recipe pinned to `variant: 'outline'` (see
 * `../badge/badge.tsx`) rather than a separate `tagVariants`, since `Tag` is
 * exactly `Badge`'s outline shape with its own default color (`neutral`,
 * vs. `Badge`'s `primary`) and no shape choice of its own — reach for `Chip`
 * instead when it needs to be dismissible.
 *
 * @example
 * ```tsx
 * <Tag color="info">Design</Tag>
 * <Tag color="accent">Engineering</Tag>
 * ```
 */
const Tag = React.forwardRef<HTMLSpanElement, TagProps>((props, forwardedRef) => {
  const { className, color = 'neutral', ...rest } = props;
  return (
    <Primitive
      as="span"
      className={cn(badgeVariants({ variant: 'outline', color }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Tag.displayName = 'Tag';

export { Tag };
export type { TagProps };
