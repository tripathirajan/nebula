import { cn } from '@nebula-lab/primitives/cn';
import { TelInput as StylelessTelInput } from '@nebula-lab/styleless/tel-input';
import * as React from 'react';

import { inputVariants } from '../input/input';

import type { TelInputProps as StylelessTelInputProps } from '@nebula-lab/styleless/tel-input';
import type { VariantProps } from 'class-variance-authority';

type TelFieldProps = StylelessTelInputProps & VariantProps<typeof inputVariants>;

/**
 * Styled `type="tel"` `Input` preset — wraps `@nebula-lab/styleless`'s
 * `TelInput` and reuses `Input`'s exact class recipe (`inputVariants`).
 *
 * @example
 * ```tsx
 * <TelField name="phone" placeholder="+1 (555) 123-4567" />
 * ```
 */
const TelField = React.forwardRef<HTMLInputElement, TelFieldProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <StylelessTelInput
      className={cn(inputVariants({ variant }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

TelField.displayName = 'TelField';

export { TelField };
export type { TelFieldProps };
