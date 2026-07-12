import { cn } from '@nebula/primitives/cn';
import { FAB as StylelessFAB } from '@nebula/styleless/fab';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { FABProps as StylelessFABProps } from '@nebula/styleless/fab';
import type { VariantProps } from 'class-variance-authority';

/**
 * Same shape/color axes `buttonVariants` exposes (minus `text`/`link`,
 * which don't apply to an icon-only floating button with no visible fill or
 * border to remove), reusing `--button-*` tokens directly — a FAB is a
 * specialized `Button` shape, not a differently-themed one, so no separate
 * `fabTokens` entry was added.
 */
const fabVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full border shadow-[var(--elevation-modal)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-base-content)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:brightness-90',
        ghost: 'bg-transparent',
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
      size: {
        sm: 'h-10 w-10',
        md: 'h-14 w-14',
        lg: 'h-16 w-16',
      },
    },
    // Every class string is written literally, not built from a
    // `${color}` template-literal interpolation — see `buttonVariants`'
    // own comment in `../button/button.tsx` for why: Tailwind's JIT
    // scanner can't discover interpolated class names via static text
    // matching, so they'd silently generate no CSS rule.
    compoundVariants: [
      {
        variant: 'default',
        color: 'primary',
        class:
          'border-[var(--button-primary-border)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]',
      },
      {
        variant: 'default',
        color: 'secondary',
        class:
          'border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)]',
      },
      {
        variant: 'default',
        color: 'accent',
        class:
          'border-[var(--button-accent-border)] bg-[var(--button-accent-bg)] text-[var(--button-accent-text)]',
      },
      {
        variant: 'default',
        color: 'neutral',
        class:
          'border-[var(--button-neutral-border)] bg-[var(--button-neutral-bg)] text-[var(--button-neutral-text)]',
      },
      {
        variant: 'default',
        color: 'info',
        class:
          'border-[var(--button-info-border)] bg-[var(--button-info-bg)] text-[var(--button-info-text)]',
      },
      {
        variant: 'default',
        color: 'success',
        class:
          'border-[var(--button-success-border)] bg-[var(--button-success-bg)] text-[var(--button-success-text)]',
      },
      {
        variant: 'default',
        color: 'warning',
        class:
          'border-[var(--button-warning-border)] bg-[var(--button-warning-bg)] text-[var(--button-warning-text)]',
      },
      {
        variant: 'default',
        color: 'danger',
        class:
          'border-[var(--button-danger-border)] bg-[var(--button-danger-bg)] text-[var(--button-danger-text)]',
      },
      {
        variant: 'ghost',
        color: 'primary',
        class:
          'border-[var(--button-primary-border)] bg-[color-mix(in_oklch,var(--button-primary-bg)_10%,transparent)] text-[var(--button-primary-border)] hover:bg-[color-mix(in_oklch,var(--button-primary-bg)_20%,transparent)]',
      },
      {
        variant: 'ghost',
        color: 'secondary',
        class:
          'border-[var(--button-secondary-border)] bg-[color-mix(in_oklch,var(--button-secondary-bg)_10%,transparent)] text-[var(--button-secondary-border)] hover:bg-[color-mix(in_oklch,var(--button-secondary-bg)_20%,transparent)]',
      },
      {
        variant: 'ghost',
        color: 'accent',
        class:
          'border-[var(--button-accent-border)] bg-[color-mix(in_oklch,var(--button-accent-bg)_10%,transparent)] text-[var(--button-accent-border)] hover:bg-[color-mix(in_oklch,var(--button-accent-bg)_20%,transparent)]',
      },
      {
        variant: 'ghost',
        color: 'neutral',
        class:
          'border-[var(--button-neutral-border)] bg-[color-mix(in_oklch,var(--button-neutral-bg)_10%,transparent)] text-[var(--button-neutral-border)] hover:bg-[color-mix(in_oklch,var(--button-neutral-bg)_20%,transparent)]',
      },
      {
        variant: 'ghost',
        color: 'info',
        class:
          'border-[var(--button-info-border)] bg-[color-mix(in_oklch,var(--button-info-bg)_10%,transparent)] text-[var(--button-info-border)] hover:bg-[color-mix(in_oklch,var(--button-info-bg)_20%,transparent)]',
      },
      {
        variant: 'ghost',
        color: 'success',
        class:
          'border-[var(--button-success-border)] bg-[color-mix(in_oklch,var(--button-success-bg)_10%,transparent)] text-[var(--button-success-border)] hover:bg-[color-mix(in_oklch,var(--button-success-bg)_20%,transparent)]',
      },
      {
        variant: 'ghost',
        color: 'warning',
        class:
          'border-[var(--button-warning-border)] bg-[color-mix(in_oklch,var(--button-warning-bg)_10%,transparent)] text-[var(--button-warning-border)] hover:bg-[color-mix(in_oklch,var(--button-warning-bg)_20%,transparent)]',
      },
      {
        variant: 'ghost',
        color: 'danger',
        class:
          'border-[var(--button-danger-border)] bg-[color-mix(in_oklch,var(--button-danger-bg)_10%,transparent)] text-[var(--button-danger-border)] hover:bg-[color-mix(in_oklch,var(--button-danger-bg)_20%,transparent)]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      color: 'primary',
      size: 'md',
    },
  },
);

type FABProps = StylelessFABProps & VariantProps<typeof fabVariants>;

/**
 * Floating Action Button — wraps `@nebula/styleless`'s `FAB` (required
 * `aria-label`, `Button`'s `loading` semantics) and adds the circular,
 * elevated styling. Deliberately does not apply `fixed` positioning itself
 * (position is a page-layout concern the consumer owns, same "don't
 * hardcode placement" rule `Sidebar`'s `side` prop follows) — pair with
 * `className="fixed bottom-6 right-6"` at the call site.
 *
 * @example
 * ```tsx
 * <FAB aria-label="Compose" className="fixed bottom-6 right-6">
 *   <PlusIcon />
 * </FAB>
 * ```
 */
const FAB = React.forwardRef<HTMLButtonElement, FABProps>((props, forwardedRef) => {
  const { className, variant, color, size, ...buttonProps } = props;

  return (
    <StylelessFAB
      className={cn(fabVariants({ variant, color, size }), className)}
      {...buttonProps}
      ref={forwardedRef}
    />
  );
});

FAB.displayName = 'FAB';

export { FAB, fabVariants };
export type { FABProps };
