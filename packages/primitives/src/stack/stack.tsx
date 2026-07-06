import * as React from 'react';

import { Flex } from '../flex/flex';

import type { FlexAlign, FlexJustify, FlexProps } from '../flex/flex';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

interface StackOwnProps {
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: number | string;
}

/** Props accepted by {@link Stack}. */
type StackProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  E,
  StackOwnProps
>;

/**
 * `Flex` pinned to `direction="column"` — a vertical stack of children with
 * consistent spacing. The common case; reach for `Flex` directly when you
 * need `row`/`row-reverse`/`column-reverse` or `wrap`.
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
    props: StackProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <Flex direction="column" {...(props as FlexProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'div', StackOwnProps>;

Stack.displayName = 'Stack';

export { Stack };
export type { StackProps, StackOwnProps };
