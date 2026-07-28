import { HStack as PrimitiveHStack } from '@nebula-lab/primitives/hstack';
import * as React from 'react';

import type { HStackOwnProps, HStackProps as PrimitiveHStackProps } from '@nebula-lab/primitives/hstack';
import type { PolymorphicComponent } from '@nebula-lab/primitives/types';

/**
 * Styled `HStack` — thin re-export of `@nebula-lab/primitives`' `Flex`
 * pinned to a single-line horizontal row (no wrap — overflow scrolls/clips
 * rather than wrapping; reach for `Inline`/`Wrap` when it should wrap).
 *
 * @example
 * ```tsx
 * <HStack gap={12}>
 *   <Avatar />
 *   <Text>Jane Doe</Text>
 * </HStack>
 * ```
 */
const HStack = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveHStackProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveHStack {...(props as PrimitiveHStackProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'div', HStackOwnProps>;

HStack.displayName = 'HStack';

export { HStack };
export type { PrimitiveHStackProps as HStackProps };
