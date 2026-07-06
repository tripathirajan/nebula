import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';
import type { VariantProps } from 'class-variance-authority';

/**
 * `Badge` intentionally exposes all eight semantic color roles (`primary`
 * through `danger`) as variants, unlike `Button` (3) — it's meant to be the
 * component that shows off the full palette, since a badge showing e.g.
 * `info`/`warning`/`accent` status is a common, legitimate use no fill
 * button variant needs. See `../tokens/component.ts`'s `badgeTokens` for the
 * semantic role each maps to.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-badge)] px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--badge-primary-bg)] text-[var(--badge-primary-text)]',
        secondary: 'bg-[var(--badge-secondary-bg)] text-[var(--badge-secondary-text)]',
        accent: 'bg-[var(--badge-accent-bg)] text-[var(--badge-accent-text)]',
        neutral: 'bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)]',
        info: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]',
        success: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]',
        warning: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]',
        danger: 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

interface BadgeProps
  extends PrimitivePropsWithRef<'span'>,
    VariantProps<typeof badgeVariants> {}

/**
 * A small status/count pill. No interactive behavior (not a button, not
 * dismissible) — for a removable tag/chip, compose `Badge` with your own
 * button rather than this component growing an `onDismiss` prop it'd need
 * to manage focus/keyboard behavior for.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">3 pending</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <Primitive
      as="span"
      className={cn(badgeVariants({ variant }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
export type { BadgeProps };
