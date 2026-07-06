import { Label } from '@nebula/primitives/label';
import * as React from 'react';

import { useFieldContext } from './field-context';

import type { ScopedProps } from './field-context';
import type { LabelProps } from '@nebula/primitives/label';

const FIELD_LABEL_NAME = 'FieldLabel';

/**
 * `Field`'s label — `htmlFor` and `required` both default from `Field`'s
 * context, so they never need to be repeated here in the common case (pass
 * either explicitly to override just this label).
 *
 * @example
 * ```tsx
 * <FieldLabel>Email</FieldLabel>
 * ```
 */
const FieldLabel = React.forwardRef<HTMLLabelElement, ScopedProps<LabelProps>>(
  (props, forwardedRef) => {
    const { __scopeField, required: requiredProp, htmlFor, ...labelProps } = props;
    const context = useFieldContext(FIELD_LABEL_NAME, __scopeField);

    return (
      <Label
        htmlFor={htmlFor ?? context.id}
        required={requiredProp ?? context.required}
        {...labelProps}
        ref={forwardedRef}
      />
    );
  },
);

FieldLabel.displayName = FIELD_LABEL_NAME;

export { FieldLabel };
