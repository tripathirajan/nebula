import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

interface InputOwnProps {
  /** Sets `aria-invalid="true"` — pair with a `FieldError`/`role="alert"` message once that component exists. */
  invalid?: boolean;
}

/** Props accepted by {@link Input}. */
type InputProps = PrimitivePropsWithRef<'input'> & InputOwnProps;

/**
 * Unstyled `input` — forwards a ref to the underlying DOM node (needed for
 * imperative focus management, e.g. a form library focusing the first
 * invalid field) and wires `invalid` to `aria-invalid` so screen readers
 * announce the error state without you having to remember the attribute
 * name.
 *
 * @example
 * ```tsx
 * <Input type="email" name="email" invalid={!!errors.email} aria-describedby="email-error" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
  const { invalid, ...rest } = props;
  return (
    <Primitive as="input" aria-invalid={invalid || undefined} {...rest} ref={forwardedRef} />
  );
});

Input.displayName = 'Input';

export { Input };
export type { InputProps };
