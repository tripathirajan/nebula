import { cn } from '@nebula/primitives/cn';
import { UrlInput as StylelessUrlInput } from '@nebula/styleless/url-input';
import * as React from 'react';

import { inputVariants } from '../input/input';

import type { UrlInputProps as StylelessUrlInputProps } from '@nebula/styleless/url-input';
import type { VariantProps } from 'class-variance-authority';

type UrlFieldProps = StylelessUrlInputProps & VariantProps<typeof inputVariants>;

/**
 * Styled `type="url"` `Input` preset — wraps `@nebula/styleless`'s
 * `UrlInput` and reuses `Input`'s exact class recipe (`inputVariants`).
 *
 * @example
 * ```tsx
 * <UrlField name="website" placeholder="https://example.com" />
 * ```
 */
const UrlField = React.forwardRef<HTMLInputElement, UrlFieldProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <StylelessUrlInput
      className={cn(inputVariants({ variant }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

UrlField.displayName = 'UrlField';

export { UrlField };
export type { UrlFieldProps };
