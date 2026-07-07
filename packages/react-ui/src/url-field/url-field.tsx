import { cn } from '@nebula/primitives/cn';
import { UrlInput as StylelessUrlInput } from '@nebula/styleless/url-input';
import * as React from 'react';

import { inputClassName } from '../input/input';

import type { UrlInputProps as StylelessUrlInputProps } from '@nebula/styleless/url-input';

type UrlFieldProps = StylelessUrlInputProps;

/**
 * Styled `type="url"` `Input` preset — wraps `@nebula/styleless`'s
 * `UrlInput` and reuses `Input`'s exact class recipe (`inputClassName`).
 *
 * @example
 * ```tsx
 * <UrlField name="website" placeholder="https://example.com" />
 * ```
 */
const UrlField = React.forwardRef<HTMLInputElement, UrlFieldProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessUrlInput className={cn(inputClassName, className)} {...rest} ref={forwardedRef} />
  );
});

UrlField.displayName = 'UrlField';

export { UrlField };
export type { UrlFieldProps };
