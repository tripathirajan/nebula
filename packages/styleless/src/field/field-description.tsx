import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useFieldContext } from './field-context';

import type { ScopedProps } from './field-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const FIELD_DESCRIPTION_NAME = 'FieldDescription';

/**
 * Helper text for a `Field` — always rendered at `Field`'s `descriptionId`
 * so `FieldControl`'s `aria-describedby` (set unconditionally, see `Field`'s
 * doc comment) resolves to it whenever this is present in the tree.
 *
 * @example
 * ```tsx
 * <FieldDescription>We'll never share your email.</FieldDescription>
 * ```
 */
const FieldDescription = React.forwardRef<HTMLParagraphElement, ScopedProps<PrimitivePropsWithRef<'p'>>>(
  (props, forwardedRef) => {
    const { __scopeField, id, ...descriptionProps } = props;
    const context = useFieldContext(FIELD_DESCRIPTION_NAME, __scopeField);

    return (
      <Primitive as="p" id={id ?? context.descriptionId} {...descriptionProps} ref={forwardedRef} />
    );
  },
);

FieldDescription.displayName = FIELD_DESCRIPTION_NAME;

export { FieldDescription };
