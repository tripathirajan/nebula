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
 * Tracks at runtime which of `FieldDescription`/`FieldError` are actually
 * mounted (`describedByIds`, updated via their own `useLayoutEffect`
 * register/unregister calls) so `FieldControl`'s `aria-describedby` only
 * ever points at ids with a real matching element — an `aria-describedby`
 * referencing a non-existent id is a real, flagged a11y violation (axe's
 * `aria-valid-attr-value` rule, not a silently-ignored no-op the way some
 * assistive tech handles a merely-empty attribute), so this can't be
 * simplified to an unconditional two-id join the way an earlier version of
 * this component did.
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

  const [describedByIds, setDescribedByIds] = React.useState<string[]>([]);
  const registerDescribedBy = React.useCallback((describedById: string) => {
    setDescribedByIds((previous) =>
      previous.includes(describedById) ? previous : [...previous, describedById],
    );
  }, []);
  const unregisterDescribedBy = React.useCallback((describedById: string) => {
    setDescribedByIds((previous) =>
      previous.includes(describedById) ? previous.filter((existing) => existing !== describedById) : previous,
    );
  }, []);

  return (
    <FieldProvider
      scope={__scopeField}
      id={id}
      descriptionId={`${id}-description`}
      errorId={`${id}-error`}
      invalid={invalid}
      disabled={disabled}
      required={required}
      describedByIds={describedByIds}
      registerDescribedBy={registerDescribedBy}
      unregisterDescribedBy={unregisterDescribedBy}
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
