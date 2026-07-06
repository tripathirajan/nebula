
import { Button as PrimitiveButton } from '@nebula/primitives/button';
import { cn } from '@nebula/primitives/cn';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { ButtonProps as PrimitiveButtonProps } from '@nebula/primitives/button';
import type { VariantProps } from 'class-variance-authority';

/**
 * Class recipe built on this package's own `buttonTokens` (see
 * `../tokens/component.ts`) via CSS-var-backed Tailwind arbitrary values —
 * swap themes by changing `data-theme`/`.dark`, not by touching this file.
 *
 * Hover state is `hover:brightness-90` rather than a second stored
 * `-bg-hover` token — the DaisyUI-style token set this package's theme is
 * built from assigns exactly one shade per semantic role (no separate
 * "hover" shade to reference), so darkening via a CSS filter keeps every
 * variant's hover state theme-aware for free instead of needing a second
 * token per variant. Corner radius reads `--radius-button` (see
 * `tokens/primitive.ts`) instead of a static Tailwind class, so it follows
 * the same override mechanism as color.
 *
 * Focus ring reads `--color-base-content` rather than `--color-primary` —
 * `primary`'s 76% lightness only clears ~2:1 as a thin ring against
 * `base-100`, well under WCAG 1.4.11's 3:1 non-text minimum (see
 * `CONTRAST_AUDIT.md`), and it's the ring's whole job to be visible.
 * `base-content` is guaranteed to invert correctly against `base-100` in
 * both themes (it's the same pairing body text uses), at the cost of the
 * ring not being brand-colored.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border text-sm font-medium transition-colors hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-base-content)] disabled:pointer-events-none disabled:opacity-50',
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
