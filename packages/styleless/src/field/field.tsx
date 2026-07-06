import { useId } from '@nebula/hooks';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { FieldProvider } from './field-context';

import type { ScopedProps } from './field-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface FieldProps extends PrimitivePropsWithRef<'div'> {
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Overrides the auto-generated id shared by every sub-part (`FieldLabel`'s `htmlFor`, `FieldControl`'s `id`, `FieldDescription`/`FieldError`'s ids all derive from this). */
  id?: string;
}

/**
 * Root of the Field compound component — wires a control (`FieldControl`) to
 * its `FieldLabel`/`FieldDescription`/`FieldError` via generated, shared ids,
 * the same `label`-`for`/`aria-describedby`/`aria-invalid` plumbing every
 * accessible form field needs, factored out once instead of hand-wired per
 * field.
 *
 * Deliberately does NOT track at runtime whether `FieldDescription`/
 * `FieldError` are actually rendered as children — `FieldControl` always
 * sets `aria-describedby` to both ids unconditionally (space-joined).
 * `aria-describedby` pointing at an id with no matching element is a no-op
 * for assistive tech (the missing id is simply skipped), so this avoids a
 * mount-registration effect for what would otherwise be a purely cosmetic
 * correctness gain — the same kind of documented simplification `Tooltip`'s
 * no-shared-delay-group note makes elsewhere in this package.
 *
 * @example
 * ```tsx
 * <Field invalid={!!error} required>
 *   <FieldLabel>Email</FieldLabel>
 *   <FieldControl asChild>
 *     <Input type="email" />
 *   </FieldControl>
 *   <FieldDescription>We'll never share this.</FieldDescription>
 *   {error ? <FieldError>{error}</FieldError> : null}
 * </Field>
 * ```
 */
const Field = React.forwardRef<HTMLDivElement, ScopedProps<FieldProps>>((props, forwardedRef) => {
  const {
    __scopeField,
    invalid = false,
    disabled = false,
    required = false,
    id: idProp,
    ...fieldProps
  } = props;

  const generatedId = useId('nebula-field');
  const id = idProp ?? generatedId;

  return (
    <FieldProvider
      scope={__scopeField}
      id={id}
      descriptionId={`${id}-description`}
      errorId={`${id}-error`}
      invalid={invalid}
      disabled={disabled}
      required={required}
    >
      <Primitive
        as="div"
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...fieldProps}
        ref={forwardedRef}
      />
    </FieldProvider>
  );
});

Field.displayName = 'Field';

export { Field };
export type { FieldProps };
