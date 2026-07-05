import * as React from 'react';

import { Flex } from '../flex/flex';

import type { FlexProps } from '../flex/flex';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/** Props accepted by {@link Center}. */
type CenterProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<E>;

/**
 * `Flex` with both axes centered (`align="center"`, `justify="center"`) —
 * for centering a single child (a spinner, an empty-state illustration, a
 * modal's content) both horizontally and vertically.
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
    props: CenterProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return (
      <Flex align="center" justify="center" {...(props as FlexProps<E>)} ref={forwardedRef} />
    );
  },
) as PolymorphicComponent<'div'>;

Center.displayName = 'Center';

export { Center };
export type { CenterProps };
