import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useFieldContext } from './field-context';

import type { ScopedProps } from './field-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const FIELD_ERROR_NAME = 'FieldError';

/**
 * Validation message for a `Field` — `role="alert"` so assistive tech
 * announces it the moment it mounts (e.g. right after a failed submit),
 * rendered at `Field`'s `errorId` and registers that id with `Field` (via
 * `useLayoutEffect`) so `FieldControl`'s `aria-describedby` includes it only
 * while this is actually mounted — see `Field`'s own doc comment. Consumers
 * are expected to only render this when there actually is an error — unlike
 * `FieldDescription`, this isn't meant to stay permanently mounted, and now
 * that `aria-describedby` tracks real mounted ids, unmounting it also
 * correctly drops it from `aria-describedby`, not just visually.
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
    const resolvedId = id ?? context.errorId;

    const { registerDescribedBy, unregisterDescribedBy } = context;
    React.useLayoutEffect(() => {
      registerDescribedBy(resolvedId);
      return () => unregisterDescribedBy(resolvedId);
      // See `FieldDescription`'s identical comment: depending on the whole
      // `context` object (a fresh identity every `Field` render) instead of
      // its stable callback references would trip React's infinite-update
      // loop guard.
    }, [registerDescribedBy, unregisterDescribedBy, resolvedId]);

    return <Primitive as="p" id={resolvedId} role="alert" {...errorProps} ref={forwardedRef} />;
  },
);

FieldError.displayName = FIELD_ERROR_NAME;

export { FieldError };
