import { Input as PrimitiveInput } from '@nebula-lab/primitives/input';
import * as React from 'react';

import type { InputProps as PrimitiveInputProps } from '@nebula-lab/primitives/input';

/** Props accepted by {@link Input}. */
type InputProps = PrimitiveInputProps;

/**
 * `styleless`-tier `Input` — a thin pass-through of `@nebula-lab/primitives`'
 * own `Input` (which already covers the one real behavior an input needs
 * pre-styling: `invalid` -> `aria-invalid` wiring). Unlike `Button`, there's
 * no additional state to decouple here — this component exists so every
 * `styleless`-tier preset (`SearchInput`, `PasswordInput`, `EmailInput`,
 * ...) has one consistent thing to build on, and so `@nebula-lab/react-ui`'s
 * `Input` chains through `styleless` like every other styled component
 * rather than reaching past it to `primitives` directly.
 *
 * @example
 * ```tsx
 * <Input type="email" name="email" invalid={!!errors.email} />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
  return <PrimitiveInput {...props} ref={forwardedRef} />;
});

Input.displayName = 'Input';

export { Input };
export type { InputProps };
