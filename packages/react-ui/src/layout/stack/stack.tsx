import { Stack as PrimitiveStack } from '@nebula-lab/primitives/stack';
import * as React from 'react';

import type { StackProps as PrimitiveStackProps } from '@nebula-lab/primitives/stack';

/**
 * Styled `Stack` — thin re-export of `@nebula-lab/primitives`' `Flex`
 * pinned to `direction="column"`. Purely structural; see `Flex`'s own doc
 * comment for why this layer adds nothing beyond re-exporting.
 *
 * @example
 * ```tsx
 * <Stack gap={8}>
 *   <Label>Email</Label>
 *   <Input type="email" />
 * </Stack>
 * ```
 */
const Stack = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveStackProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveStack {...(props as PrimitiveStackProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveStack;

Stack.displayName = 'Stack';

export { Stack };
export type { PrimitiveStackProps as StackProps };
