import { cn } from '@nebula/primitives/cn';
import { Input as StylelessInput } from '@nebula/styleless/input';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { InputProps as StylelessInputProps } from '@nebula/styleless/input';
import type { VariantProps } from 'class-variance-authority';

/**
 * This package's own shared class recipe, reused by every `Input`-based
 * preset (`SearchField`/`PasswordField`/`EmailField`/`UrlField`/`TelField`)
 * so they all stay pixel-identical without duplicating the string.
 */
const inputVariants = cva(
  'flex h-10 w-full min-w-0 px-3 py-2 text-sm text-[var(--input-text)] transition-colors placeholder:text-[var(--input-text)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:focus-visible:ring-[var(--input-invalid-ring)]',
  {
    variants: {
      variant: {
        outline:
          'rounded-[var(--radius-field)] border border-[var(--input-border)] bg-[var(--input-bg)] aria-[invalid=true]:border-[var(--input-invalid-border)]',
        filled:
          'rounded-[var(--radius-field)] border border-transparent bg-[var(--input-filled-bg)] aria-[invalid=true]:border-[var(--input-invalid-border)]',
        underline:
          'rounded-none border-0 border-b border-[var(--input-border)] bg-transparent px-1 aria-[invalid=true]:border-b-[var(--input-invalid-border)]',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
);

/** Resolved default-variant class string, kept for any existing import site that still wants a plain string. */
const inputClassName = inputVariants({ variant: 'outline' });

type InputProps = StylelessInputProps & VariantProps<typeof inputVariants>;

/**
 * Styled `input` — wraps `@nebula/styleless`'s `Input` (itself a thin pass-
 * through of `@nebula/primitives`' `Input`, which gives `invalid` ->
 * `aria-invalid` wiring and ref forwarding) rather than reaching past it to
 * `primitives` directly, per `react-ui`'s "builds on `styleless`, not
 * around it" rule (see `component-library-architecture.md` §2 — same
 * reasoning as `Button`).
 *
 * Colors read `--input-*` (see `../tokens/component.ts`), not `--color-*`
 * directly — same indirection `Button` already used, applied consistently
 * to every styled component now: overriding `Input`'s look never risks
 * also affecting some other component that happens to read the same
 * semantic color.
 *
 * @example
 * ```tsx
 * <Input type="email" name="email" placeholder="you@example.com" />
 * <Input invalid aria-describedby="email-error" />
 * <Input variant="filled" />
 * <Input variant="underline" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <StylelessInput className={cn(inputVariants({ variant }), className)} {...rest} ref={forwardedRef} />
  );
});

Input.displayName = 'Input';

export { Input, inputVariants, inputClassName };
export type { InputProps };
