import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useFieldContext } from './field-context';

import type { ScopedProps } from './field-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const FIELD_CONTROL_NAME = 'FieldControl';

interface FieldControlProps extends PrimitivePropsWithRef<'input'> {
  asChild?: boolean;
}

/**
 * Wraps the actual form control (an `Input`/`Textarea`/custom widget passed
 * via `asChild`, since a control's tag varies far more than e.g. a
 * `DialogTrigger`'s always-a-button shape) and injects the `id`/`aria-*`
 * wiring `Field`'s context computed: `id`, `aria-invalid`, `aria-required`,
 * `aria-describedby`, and `disabled` all come from context by default —
 * pass any of them explicitly here to override just this control.
 *
 * @example
 * ```tsx
 * <FieldControl asChild>
 *   <Input type="email" />
 * </FieldControl>
 * ```
 */
const FieldControl = React.forwardRef<HTMLInputElement, ScopedProps<FieldControlProps>>(
  (props, forwardedRef) => {
    const {
      __scopeField,
      id,
      disabled,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
      'aria-describedby': ariaDescribedBy,
      ...controlProps
    } = props;
    const context = useFieldContext(FIELD_CONTROL_NAME, __scopeField);
    const describedBy =
      ariaDescribedBy ?? (context.describedByIds.length > 0 ? context.describedByIds.join(' ') : undefined);

    return (
      <Primitive
        as="input"
        id={id ?? context.id}
        aria-invalid={ariaInvalid ?? (context.invalid || undefined)}
        aria-required={ariaRequired ?? (context.required || undefined)}
        aria-describedby={describedBy}
        disabled={disabled ?? context.disabled}
        {...controlProps}
        ref={forwardedRef}
      />
    );
  },
);

FieldControl.displayName = FIELD_CONTROL_NAME;

export { FieldControl };
export type { FieldControlProps };
