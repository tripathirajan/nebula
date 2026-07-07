import { cn } from '@nebula/primitives/cn';
import { EmailInput as StylelessEmailInput } from '@nebula/styleless/email-input';
import * as React from 'react';

import { inputClassName } from '../input/input';

import type { EmailInputProps as StylelessEmailInputProps } from '@nebula/styleless/email-input';

type EmailFieldProps = StylelessEmailInputProps;

/**
 * Styled `type="email"` `Input` preset — wraps `@nebula/styleless`'s
 * `EmailInput` and reuses `Input`'s exact class recipe (`inputClassName`),
 * same "preset over the one real `Input`" shape `SearchField` established.
 *
 * @example
 * ```tsx
 * <EmailField name="email" placeholder="you@example.com" />
 * ```
 */
const EmailField = React.forwardRef<HTMLInputElement, EmailFieldProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessEmailInput className={cn(inputClassName, className)} {...rest} ref={forwardedRef} />
  );
});

EmailField.displayName = 'EmailField';

export { EmailField };
export type { EmailFieldProps };
