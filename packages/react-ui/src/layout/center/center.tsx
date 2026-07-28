import { Center as PrimitiveCenter } from '@nebula-lab/primitives/center';
import * as React from 'react';

import type { CenterProps as PrimitiveCenterProps } from '@nebula-lab/primitives/center';
import type { PolymorphicComponent } from '@nebula-lab/primitives/types';

/**
 * Styled `Center` — thin re-export of `@nebula-lab/primitives`' `Flex`
 * with both axes centered, for centering a single child (a spinner, an
 * empty-state illustration) both horizontally and vertically.
 *
 * @example
 * ```tsx
 * <Center style={{ height: 240 }}>
 *   <Spinner />
 * </Center>
 * ```
 */
const Center = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveCenterProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveCenter {...(props as PrimitiveCenterProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'div'>;

Center.displayName = 'Center';

export { Center };
export type { PrimitiveCenterProps as CenterProps };
