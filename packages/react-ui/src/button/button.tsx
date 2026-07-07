
import { cn } from '@nebula/primitives/cn';
import { Button as StylelessButton } from '@nebula/styleless/button';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { ButtonProps as StylelessButtonProps } from '@nebula/styleless/button';
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

type ButtonProps = StylelessButtonProps & VariantProps<typeof buttonVariants>;

/**
 * Styled `Button` — the `react-ui` layer's job is purely visual, so this
 * wraps `@nebula/styleless`'s `Button` (which already gives `asChild`
 * support, the `type="button"` default, and real `loading` semantics —
 * `aria-busy`/`data-loading`/forced-`disabled`) rather than reaching for
 * `@nebula/primitives` directly, per the layering in
 * `component-library-architecture.md` §2: `react-ui` builds on `styleless`,
 * not around it. This file's own job is exactly one thing: turning
 * `variant`/`size` into Tailwind classes via `buttonVariants`.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Save changes</Button>
 * <Button variant="danger" loading>Deleting…</Button>
 * <Button asChild variant="secondary"><a href="/">Link button</a></Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { className, variant, size, ...buttonProps } = props;

  return (
    <StylelessButton
      className={cn(buttonVariants({ variant, size }), className)}
      {...buttonProps}
      ref={forwardedRef}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
