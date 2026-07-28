import { Container as PrimitiveContainer } from '@nebula-lab/primitives/container';
import * as React from 'react';

import type { ContainerProps as PrimitiveContainerProps } from '@nebula-lab/primitives/container';

/**
 * Styled `Container` — thin re-export of `@nebula-lab/primitives`'
 * `Container` (horizontally centers content, caps width at `size`, adds
 * responsive horizontal padding). Purely structural, no color/token
 * opinion of its own.
 *
 * @example
 * ```tsx
 * <Container size="md">
 *   <Heading as="h1">Settings</Heading>
 * </Container>
 * ```
 */
const Container = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveContainerProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveContainer {...(props as PrimitiveContainerProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveContainer;

Container.displayName = 'Container';

export { Container };
export type { PrimitiveContainerProps as ContainerProps };
