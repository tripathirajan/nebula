import * as React from 'react';

import { Input } from '../input/input';

import type { InputProps } from '../input/input';

/** Props accepted by {@link EmailInput}. */
type EmailInputProps = Omit<InputProps, 'type'>;

/**
 * `styleless`-tier `EmailInput` — an `Input` preset to `type="email"`,
 * which gets the browser's own format validation and mobile `@`-key
 * keyboard layout for free. Net-new (no prior `react-ui` counterpart) —
 * same "cheap preset" shape `SearchInput` already establishes.
 *
 * @example
 * ```tsx
 * <EmailInput name="email" placeholder="you@example.com" />
 * ```
 */
const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>((props, forwardedRef) => {
  return <Input type="email" {...props} ref={forwardedRef} />;
});

EmailInput.displayName = 'EmailInput';

export { EmailInput };
export type { EmailInputProps };
