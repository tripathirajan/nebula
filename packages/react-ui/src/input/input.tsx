import { cn } from '@nebula/primitives/cn';
import { Input as StylelessInput } from '@nebula/styleless/input';
import * as React from 'react';

import type { InputProps as StylelessInputProps } from '@nebula/styleless/input';

/** This package's own shared class recipe, reused by every `Input`-based preset (`SearchField`/`PasswordField`/`EmailField`/`UrlField`/`TelField`) so they all stay pixel-identical without duplicating the string. */
const inputClassName =
  'flex h-10 w-full min-w-0 rounded-[var(--radius-field)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--input-text)] transition-colors placeholder:text-[var(--input-text)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--input-invalid-border)] aria-[invalid=true]:focus-visible:ring-[var(--input-invalid-ring)]';

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
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, StylelessInputProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return <StylelessInput className={cn(inputClassName, className)} {...rest} ref={forwardedRef} />;
});

Input.displayName = 'Input';

export { Input, inputClassName };
export type { StylelessInputProps as InputProps };
