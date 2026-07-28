import { VStack as PrimitiveVStack } from '@nebula-lab/primitives/vstack';
import * as React from 'react';

import type { VStackProps as PrimitiveVStackProps } from '@nebula-lab/primitives/vstack';

/**
 * Styled `VStack` — alias of `Stack` under the name consumers coming from
 * Chakra UI reach for first. Thin re-export; see `Flex`'s own doc comment
 * for why this layer adds nothing beyond re-exporting.
 *
 * @example
 * ```tsx
 * <VStack gap={8}>
 *   <Label>Email</Label>
 *   <Input type="email" />
 * </VStack>
 * ```
 */
const VStack = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveVStackProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveVStack {...(props as PrimitiveVStackProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveVStack;

VStack.displayName = 'VStack';

export { VStack };
export type { PrimitiveVStackProps as VStackProps };
