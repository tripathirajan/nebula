import { cn } from '@nebula/primitives/cn';
import { Input as PrimitiveInput } from '@nebula/primitives/input';
import * as React from 'react';

import type { InputProps as PrimitiveInputProps } from '@nebula/primitives/input';

/**
 * Styled `input` — wraps `@nebula/primitives`' unstyled `Input` (which
 * already gives `invalid` -> `aria-invalid` wiring and ref forwarding)
 * rather than reaching for `Primitive` directly, per `ui`'s "builds on
 * `primitives`, not around it" rule (see `component-library-architecture.md`
 * §2 — same reasoning as `Button`).
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
const Input = React.forwardRef<HTMLInputElement, PrimitiveInputProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <PrimitiveInput
      className={cn(
        'flex h-10 w-full min-w-0 rounded-[var(--radius-field)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--input-text)] transition-colors placeholder:text-[var(--input-text)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--input-invalid-border)] aria-[invalid=true]:focus-visible:ring-[var(--input-invalid-ring)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Input.displayName = 'Input';

export { Input };
export type { PrimitiveInputProps as InputProps };
