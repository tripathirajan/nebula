import { cn } from '@nebula/primitives/cn';
import { FAB as StylelessFAB } from '@nebula/styleless/fab';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { FABProps as StylelessFABProps } from '@nebula/styleless/fab';
import type { VariantProps } from 'class-variance-authority';

/**
 * Same three semantic color variants `buttonVariants` exposes, reusing
 * `--button-*` tokens directly — a FAB is a specialized `Button` shape, not
 * a differently-themed one, so no separate `fabTokens` entry was added.
 */
const fabVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full border shadow-lg outline-none transition-colors hover:brightness-90 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-base-content)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'border-[var(--button-primary-border)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]',
        secondary:
          'border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)]',
        danger:
          'border-[var(--button-danger-border)] bg-[var(--button-danger-bg)] text-[var(--button-danger-text)]',
      },
      size: {
        sm: 'h-10 w-10',
        md: 'h-14 w-14',
        lg: 'h-16 w-16',
      },
    },
    defaultVariants: {
      variant: 'primary',
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
  const { className, variant, size, ...buttonProps } = props;

  return (
    <StylelessFAB
      className={cn(fabVariants({ variant, size }), className)}
      {...buttonProps}
      ref={forwardedRef}
    />
  );
});

FAB.displayName = 'FAB';

export { FAB, fabVariants };
export type { FABProps };
