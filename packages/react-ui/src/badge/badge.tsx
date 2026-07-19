import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';
import type { VariantProps } from 'class-variance-authority';

/**
 * `Badge` intentionally exposes all eight semantic color roles (`primary`
 * through `danger`) via its `color` axis, unlike `Button` (which reuses this
 * same palette but is the one with a wider shape vocabulary) — it's meant
 * to be the component that shows off the full palette, since a badge
 * showing e.g. `info`/`warning`/`accent` status is a common, legitimate use.
 * `variant` is a narrower shape axis than `Button`'s (`default`/`outline`
 * only — no `ghost`/`text`/`link`, since a status pill is always either
 * filled or outlined, never button-shaped). `Tag` (`../tag/tag.tsx`) is
 * exactly this component's `outline` shape pinned to its own default color,
 * reusing `badgeVariants` directly rather than duplicating the outline
 * class recipe. See `../tokens/component.ts`'s `badgeTokens` for the
 * semantic role each `color` maps to.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-badge)] px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: '',
        outline: 'border bg-transparent',
      },
      color: {
        primary: '',
        secondary: '',
        accent: '',
        neutral: '',
        info: '',
        success: '',
        warning: '',
        danger: '',
      },
    },
    // Every class string is written literally, not built from a
    // `${color}` template-literal interpolation — see `buttonVariants`'
    // own comment in `../button/button.tsx` for why: Tailwind's JIT
    // scanner can't discover interpolated class names via static text
    // matching, so they'd silently generate no CSS rule.
    compoundVariants: [
      { variant: 'default', color: 'primary', class: 'bg-[var(--badge-primary-bg)] text-[var(--badge-primary-text)]' },
      { variant: 'default', color: 'secondary', class: 'bg-[var(--badge-secondary-bg)] text-[var(--badge-secondary-text)]' },
      { variant: 'default', color: 'accent', class: 'bg-[var(--badge-accent-bg)] text-[var(--badge-accent-text)]' },
      { variant: 'default', color: 'neutral', class: 'bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)]' },
      { variant: 'default', color: 'info', class: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]' },
      { variant: 'default', color: 'success', class: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]' },
      { variant: 'default', color: 'warning', class: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]' },
      { variant: 'default', color: 'danger', class: 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)]' },
      { variant: 'outline', color: 'primary', class: 'border-[var(--badge-primary-bg)] text-[var(--badge-primary-bg)]' },
      { variant: 'outline', color: 'secondary', class: 'border-[var(--badge-secondary-bg)] text-[var(--badge-secondary-bg)]' },
      { variant: 'outline', color: 'accent', class: 'border-[var(--badge-accent-bg)] text-[var(--badge-accent-bg)]' },
      { variant: 'outline', color: 'neutral', class: 'border-[var(--badge-neutral-bg)] text-[var(--badge-neutral-bg)]' },
      { variant: 'outline', color: 'info', class: 'border-[var(--badge-info-bg)] text-[var(--badge-info-bg)]' },
      { variant: 'outline', color: 'success', class: 'border-[var(--badge-success-bg)] text-[var(--badge-success-bg)]' },
      { variant: 'outline', color: 'warning', class: 'border-[var(--badge-warning-bg)] text-[var(--badge-warning-bg)]' },
      { variant: 'outline', color: 'danger', class: 'border-[var(--badge-danger-bg)] text-[var(--badge-danger-bg)]' },
    ],
    defaultVariants: {
      variant: 'default',
      color: 'primary',
    },
  },
);

interface BadgeProps
  extends Omit<PrimitivePropsWithRef<'span'>, 'color'>,
    VariantProps<typeof badgeVariants> {}

/**
 * A small status/count pill. No interactive behavior (not a button, not
 * dismissible) — for a removable tag/chip, compose `Badge` with your own
 * button rather than this component growing an `onDismiss` prop it'd need
 * to manage focus/keyboard behavior for.
 *
 * @example
 * ```tsx
 * <Badge color="success">Active</Badge>
 * <Badge color="warning">3 pending</Badge>
 * <Badge variant="outline" color="info">Draft</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>((props, forwardedRef) => {
  const { className, variant, color, ...rest } = props;
  return (
    <Primitive
      as="span"
      className={cn(badgeVariants({ variant, color }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
export type { BadgeProps };
