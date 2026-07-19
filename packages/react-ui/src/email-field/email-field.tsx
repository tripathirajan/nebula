import { cn } from '@nebula-lab/primitives/cn';
import { EmailInput as StylelessEmailInput } from '@nebula-lab/styleless/email-input';
import * as React from 'react';

import { inputVariants } from '../input/input';

import type { EmailInputProps as StylelessEmailInputProps } from '@nebula-lab/styleless/email-input';
import type { VariantProps } from 'class-variance-authority';

type EmailFieldProps = StylelessEmailInputProps & VariantProps<typeof inputVariants>;

/**
 * Styled `type="email"` `Input` preset — wraps `@nebula-lab/styleless`'s
 * `EmailInput` and reuses `Input`'s exact class recipe (`inputVariants`),
 * same "preset over the one real `Input`" shape `SearchField` established.
 *
 * @example
 * ```tsx
 * <EmailField name="email" placeholder="you@example.com" />
 * <EmailField variant="filled" />
 * ```
 */
const EmailField = React.forwardRef<HTMLInputElement, EmailFieldProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <StylelessEmailInput
      className={cn(inputVariants({ variant }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

EmailField.displayName = 'EmailField';

export { EmailField };
export type { EmailFieldProps };
