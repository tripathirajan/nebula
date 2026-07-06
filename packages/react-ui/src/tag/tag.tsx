import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';
import type { VariantProps } from 'class-variance-authority';

/**
 * Same eight semantic color roles `Badge` exposes (it's the "show off the
 * full palette" component too, for categorization labels rather than
 * status), but outlined instead of filled — `border-current` + transparent
 * background is the one visual distinction from `Badge`, so the two read as
 * different affordances (a filled status pill vs. an outlined category
 * label) even though they share a color vocabulary.
 */
const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-badge)] border px-2 py-0.5 text-xs font-medium bg-transparent',
  {
    variants: {
      variant: {
        primary: 'border-[var(--badge-primary-bg)] text-[var(--badge-primary-bg)]',
        secondary: 'border-[var(--badge-secondary-bg)] text-[var(--badge-secondary-bg)]',
        accent: 'border-[var(--badge-accent-bg)] text-[var(--badge-accent-bg)]',
        neutral: 'border-[var(--badge-neutral-bg)] text-[var(--badge-neutral-bg)]',
        info: 'border-[var(--badge-info-bg)] text-[var(--badge-info-bg)]',
        success: 'border-[var(--badge-success-bg)] text-[var(--badge-success-bg)]',
        warning: 'border-[var(--badge-warning-bg)] text-[var(--badge-warning-bg)]',
        danger: 'border-[var(--badge-danger-bg)] text-[var(--badge-danger-bg)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

interface TagProps extends PrimitivePropsWithRef<'span'>, VariantProps<typeof tagVariants> {}

/**
 * A non-interactive category/keyword label — reuses `badgeTokens`' semantic
 * colors directly (see `../tokens/component.ts`) rather than a separate
 * token object, since it's the exact same eight-color palette, just
 * outlined; reach for `Chip` instead when it needs to be dismissible.
 *
 * @example
 * ```tsx
 * <Tag variant="info">Design</Tag>
 * <Tag variant="accent">Engineering</Tag>
 * ```
 */
const Tag = React.forwardRef<HTMLSpanElement, TagProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <Primitive
      as="span"
      className={cn(tagVariants({ variant }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Tag.displayName = 'Tag';

export { Tag, tagVariants };
export type { TagProps };
