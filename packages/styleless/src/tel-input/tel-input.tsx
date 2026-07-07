import * as React from 'react';

import { Input } from '../input/input';

import type { InputProps } from '../input/input';

/** Props accepted by {@link TelInput}. */
type TelInputProps = Omit<InputProps, 'type'>;

/**
 * `styleless`-tier `TelInput` — an `Input` preset to `type="tel"`, which
 * gets the mobile numeric-phone-pad keyboard layout for free (unlike
 * `type="number"`, it doesn't reject non-digit characters like `+`/`(`/`)`,
 * which real phone numbers need). Net-new — same "cheap preset" shape
 * `SearchInput`/`EmailInput`/`UrlInput` already establish.
 *
 * @example
 * ```tsx
 * <TelInput name="phone" placeholder="+1 (555) 123-4567" />
 * ```
 */
const TelInput = React.forwardRef<HTMLInputElement, TelInputProps>((props, forwardedRef) => {
  return <Input type="tel" {...props} ref={forwardedRef} />;
});

TelInput.displayName = 'TelInput';

export { TelInput };
export type { TelInputProps };
