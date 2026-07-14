import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useFieldContext } from './field-context';

import type { ScopedProps } from './field-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const FIELD_DESCRIPTION_NAME = 'FieldDescription';

/**
 * Helper text for a `Field` — rendered at `Field`'s `descriptionId` and
 * registers that id with `Field` (via `useLayoutEffect`) so `FieldControl`'s
 * `aria-describedby` includes it only while this is actually mounted — see
 * `Field`'s own doc comment for why this can't be a static, unconditional id.
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
    const resolvedId = id ?? context.descriptionId;

    const { registerDescribedBy, unregisterDescribedBy } = context;
    React.useLayoutEffect(() => {
      registerDescribedBy(resolvedId);
      return () => unregisterDescribedBy(resolvedId);
      // `registerDescribedBy`/`unregisterDescribedBy` are stable (`useCallback`
      // with `[]` deps in `Field`) — depending on the whole `context` object
      // instead would re-fire this effect every time `Field` re-renders (a
      // fresh context value object each render), which repeatedly calls
      // `setDescribedByIds` and trips React's "Maximum update depth exceeded"
      // loop guard.
    }, [registerDescribedBy, unregisterDescribedBy, resolvedId]);

    return <Primitive as="p" id={resolvedId} {...descriptionProps} ref={forwardedRef} />;
  },
);

FieldDescription.displayName = FIELD_DESCRIPTION_NAME;

export { FieldDescription };
