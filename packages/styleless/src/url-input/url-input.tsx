import * as React from 'react';

import { Input } from '../input/input';

import type { InputProps } from '../input/input';

/** Props accepted by {@link UrlInput}. */
type UrlInputProps = Omit<InputProps, 'type'>;

/**
 * `styleless`-tier `UrlInput` — an `Input` preset to `type="url"`, which
 * gets the browser's own format validation and mobile `.`/`/`-key keyboard
 * layout for free. Net-new — same "cheap preset" shape `SearchInput`/
 * `EmailInput` already establish.
 *
 * @example
 * ```tsx
 * <UrlInput name="website" placeholder="https://example.com" />
 * ```
 */
const UrlInput = React.forwardRef<HTMLInputElement, UrlInputProps>((props, forwardedRef) => {
  return <Input type="url" {...props} ref={forwardedRef} />;
});

UrlInput.displayName = 'UrlInput';

export { UrlInput };
export type { UrlInputProps };
