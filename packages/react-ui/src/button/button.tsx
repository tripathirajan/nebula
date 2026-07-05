
import { Button as PrimitiveButton } from '@nebula/primitives/button';
import { cn } from '@nebula/primitives/cn';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { ButtonProps as PrimitiveButtonProps } from '@nebula/primitives/button';
import type { VariantProps } from 'class-variance-authority';

/**
 * Class recipe built on this package's own `buttonTokens` (see
 * `../tokens/component.ts`) via CSS-var-backed Tailwind arbitrary values —
 * swap themes by changing `data-theme`, not by touching this file.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-border-focus)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'border-[var(--button-primary-border)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)]',
        secondary:
          'border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-bg-hover)]',
        danger:
          'border-[var(--button-danger-border)] bg-[var(--button-danger-bg)] text-[var(--button-danger-text)] hover:bg-[var(--button-danger-bg-hover)]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface ButtonProps extends PrimitiveButtonProps, VariantProps<typeof buttonVariants> {
  /**
   * Shows a busy state (`aria-busy`, `data-loading`) and disables the
   * button. No spinner icon is rendered here — style `[data-loading]` or
   * compose with a `Spinner` once that primitive exists; keeping this
   * component free of an opinion on the icon.
   */
  loading?: boolean;
}

/**
 * Styled `Button` — the `ui` layer's job is purely visual, so this wraps
 * `@nebula/primitives`' unstyled `Button` (which already gives `asChild`
 * support and the `type="button"` default) rather than reaching for
 * `Primitive` directly, per the layering in
 * `component-library-architecture.md` §2: `ui` builds on `primitives`, not
 * around it.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Save changes</Button>
 * <Button variant="danger" loading>Deleting…</Button>
 * <Button asChild variant="secondary"><a href="/">Link button</a></Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { className, variant, size, loading = false, disabled, ...buttonProps } = props;

  return (
    <PrimitiveButton
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      {...buttonProps}
      ref={forwardedRef}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
