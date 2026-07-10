
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
 * Two independent axes: `variant` is the *shape* (`default` solid filled,
 * `ghost` light-tinted with a colored border, `text` colored text only,
 * `link` `text` plus an underline), `color` is the *hue* — every shape/color
 * combination reads the same `buttonTokens.<color>` triple, just applies
 * `bg`/`text`/`border` differently per shape (see `compoundVariants` below),
 * so no per-shape token entries exist. `ghost`/`text`/`link` all read the
 * color's `-border` token for their text color (the raw hue itself), not
 * `-text` (that's the *on-filled-bg* content color, e.g. white-on-primary —
 * wrong once there's no filled background to sit on).
 *
 * Hover state on `default` is `hover:brightness-90` rather than a second
 * stored `-bg-hover` token — the DaisyUI-style token set this package's
 * theme is built from assigns exactly one shade per semantic role (no
 * separate "hover" shade to reference), so darkening via a CSS filter keeps
 * every color's hover state theme-aware for free. `ghost`/`text` use a
 * subtle tinted background instead, written as a full `color-mix(...)`
 * arbitrary value (`bg-[color-mix(in_oklch,var(...)_10%,transparent)]`)
 * rather than Tailwind's `/10` opacity-modifier suffix on an arbitrary
 * `var()` background — that suffix form doesn't reliably generate a rule
 * for arbitrary CSS-variable values in this project's Tailwind setup
 * (confirmed empirically: no matching rule appears in the built CSS),
 * whereas a fully-spelled-out arbitrary value is unambiguous, always
 * generated. `link` just underlines, no tint needed. Corner radius reads
 * `--radius-button` (see `tokens/primitive.ts`) instead of a static
 * Tailwind class, so it follows the same override mechanism as color.
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
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-base-content)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:brightness-90',
        ghost: 'bg-transparent',
        text: 'border-transparent bg-transparent',
        link: 'border-transparent bg-transparent underline-offset-4 hover:underline',
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
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    // Every class string below is written out literally (not built from a
    // `${color}` template-literal interpolation) — Tailwind's JIT scanner
    // extracts utility class names via static text matching against the
    // source file, so an interpolated class name like
    // `` `bg-[var(--button-${c}-bg)]` `` is invisible to it and silently
    // never generates a CSS rule (confirmed empirically: some interpolated
    // classes happened to also appear literally elsewhere and worked by
    // coincidence, most didn't and rendered with no background at all).
    compoundVariants: [
      {
        variant: 'default',
        color: 'primary',
        class:
          'border-[var(--button-primary-border)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]',
      },
      {
        variant: 'ghost',
        color: 'primary',
        class:
          'border-[var(--button-primary-border)] bg-[color-mix(in_oklch,var(--button-primary-bg)_10%,transparent)] text-[var(--button-primary-border)] hover:bg-[color-mix(in_oklch,var(--button-primary-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'primary',
        class:
          'text-[var(--button-primary-border)] hover:bg-[color-mix(in_oklch,var(--button-primary-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'primary', class: 'text-[var(--button-primary-border)]' },
      {
        variant: 'default',
        color: 'secondary',
        class:
          'border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)]',
      },
      {
        variant: 'ghost',
        color: 'secondary',
        class:
          'border-[var(--button-secondary-border)] bg-[color-mix(in_oklch,var(--button-secondary-bg)_10%,transparent)] text-[var(--button-secondary-border)] hover:bg-[color-mix(in_oklch,var(--button-secondary-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'secondary',
        class:
          'text-[var(--button-secondary-border)] hover:bg-[color-mix(in_oklch,var(--button-secondary-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'secondary', class: 'text-[var(--button-secondary-border)]' },
      {
        variant: 'default',
        color: 'accent',
        class:
          'border-[var(--button-accent-border)] bg-[var(--button-accent-bg)] text-[var(--button-accent-text)]',
      },
      {
        variant: 'ghost',
        color: 'accent',
        class:
          'border-[var(--button-accent-border)] bg-[color-mix(in_oklch,var(--button-accent-bg)_10%,transparent)] text-[var(--button-accent-border)] hover:bg-[color-mix(in_oklch,var(--button-accent-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'accent',
        class:
          'text-[var(--button-accent-border)] hover:bg-[color-mix(in_oklch,var(--button-accent-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'accent', class: 'text-[var(--button-accent-border)]' },
      {
        variant: 'default',
        color: 'neutral',
        class:
          'border-[var(--button-neutral-border)] bg-[var(--button-neutral-bg)] text-[var(--button-neutral-text)]',
      },
      {
        variant: 'ghost',
        color: 'neutral',
        class:
          'border-[var(--button-neutral-border)] bg-[color-mix(in_oklch,var(--button-neutral-bg)_10%,transparent)] text-[var(--button-neutral-border)] hover:bg-[color-mix(in_oklch,var(--button-neutral-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'neutral',
        class:
          'text-[var(--button-neutral-border)] hover:bg-[color-mix(in_oklch,var(--button-neutral-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'neutral', class: 'text-[var(--button-neutral-border)]' },
      {
        variant: 'default',
        color: 'info',
        class:
          'border-[var(--button-info-border)] bg-[var(--button-info-bg)] text-[var(--button-info-text)]',
      },
      {
        variant: 'ghost',
        color: 'info',
        class:
          'border-[var(--button-info-border)] bg-[color-mix(in_oklch,var(--button-info-bg)_10%,transparent)] text-[var(--button-info-border)] hover:bg-[color-mix(in_oklch,var(--button-info-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'info',
        class:
          'text-[var(--button-info-border)] hover:bg-[color-mix(in_oklch,var(--button-info-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'info', class: 'text-[var(--button-info-border)]' },
      {
        variant: 'default',
        color: 'success',
        class:
          'border-[var(--button-success-border)] bg-[var(--button-success-bg)] text-[var(--button-success-text)]',
      },
      {
        variant: 'ghost',
        color: 'success',
        class:
          'border-[var(--button-success-border)] bg-[color-mix(in_oklch,var(--button-success-bg)_10%,transparent)] text-[var(--button-success-border)] hover:bg-[color-mix(in_oklch,var(--button-success-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'success',
        class:
          'text-[var(--button-success-border)] hover:bg-[color-mix(in_oklch,var(--button-success-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'success', class: 'text-[var(--button-success-border)]' },
      {
        variant: 'default',
        color: 'warning',
        class:
          'border-[var(--button-warning-border)] bg-[var(--button-warning-bg)] text-[var(--button-warning-text)]',
      },
      {
        variant: 'ghost',
        color: 'warning',
        class:
          'border-[var(--button-warning-border)] bg-[color-mix(in_oklch,var(--button-warning-bg)_10%,transparent)] text-[var(--button-warning-border)] hover:bg-[color-mix(in_oklch,var(--button-warning-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'warning',
        class:
          'text-[var(--button-warning-border)] hover:bg-[color-mix(in_oklch,var(--button-warning-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'warning', class: 'text-[var(--button-warning-border)]' },
      {
        variant: 'default',
        color: 'danger',
        class:
          'border-[var(--button-danger-border)] bg-[var(--button-danger-bg)] text-[var(--button-danger-text)]',
      },
      {
        variant: 'ghost',
        color: 'danger',
        class:
          'border-[var(--button-danger-border)] bg-[color-mix(in_oklch,var(--button-danger-bg)_10%,transparent)] text-[var(--button-danger-border)] hover:bg-[color-mix(in_oklch,var(--button-danger-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'danger',
        class:
          'text-[var(--button-danger-border)] hover:bg-[color-mix(in_oklch,var(--button-danger-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'danger', class: 'text-[var(--button-danger-border)]' },
    ],
    defaultVariants: {
      variant: 'default',
      color: 'primary',
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
 * `variant`/`color`/`size` into Tailwind classes via `buttonVariants`.
 *
 * @example
 * ```tsx
 * <Button color="primary" size="md">Save changes</Button>
 * <Button color="danger" loading>Deleting…</Button>
 * <Button asChild color="secondary"><a href="/">Link button</a></Button>
 * <Button variant="ghost" color="neutral">Continue with Google</Button>
 * <Button variant="text" color="primary">Learn more</Button>
 * <Button variant="link" color="primary">Learn more</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { className, variant, color, size, ...buttonProps } = props;

  return (
    <StylelessButton
      className={cn(buttonVariants({ variant, color, size }), className)}
      {...buttonProps}
      ref={forwardedRef}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
