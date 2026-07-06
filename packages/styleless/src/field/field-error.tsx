import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useFieldContext } from './field-context';

import type { ScopedProps } from './field-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const FIELD_ERROR_NAME = 'FieldError';

/**
 * Validation message for a `Field` — `role="alert"` so assistive tech
 * announces it the moment it mounts (e.g. right after a failed submit),
 * rendered at `Field`'s `errorId` so `FieldControl`'s `aria-describedby`
 * (set unconditionally, see `Field`'s doc comment) resolves to it. Consumers
 * are expected to only render this when there actually is an error — unlike
 * `FieldDescription`, this isn't meant to stay permanently mounted.
 *
 * @example
 * ```tsx
 * {error ? <FieldError>{error}</FieldError> : null}
 * ```
 */
const FieldError = React.forwardRef<HTMLParagraphElement, ScopedProps<PrimitivePropsWithRef<'p'>>>(
  (props, forwardedRef) => {
    const { __scopeField, id, ...errorProps } = props;
    const context = useFieldContext(FIELD_ERROR_NAME, __scopeField);

    return (
      <Primitive
        as="p"
        id={id ?? context.errorId}
        role="alert"
        {...errorProps}
        ref={forwardedRef}
      />
    );
  },
);

FieldError.displayName = FIELD_ERROR_NAME;

export { FieldError };
