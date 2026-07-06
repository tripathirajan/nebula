
import * as React from 'react';

import { Flex } from '../flex/flex';

import type { FlexAlign, FlexJustify, FlexProps } from '../flex/flex';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';


interface HStackOwnProps {
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: number | string;
}

/** Props accepted by {@link HStack}. */
type HStackProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  E,
  HStackOwnProps
>;

/**
 * `Flex` pinned to `direction="row"`, `align="center"`, and no wrapping —
 * a horizontal row of children that stays on one line and overflows rather
 * than wrapping. This is the key difference from `Inline`/`Wrap` (row +
 * `wrap` on by default): reach for `HStack` when overflow should scroll or
 * clip (a toolbar, a single-line stat row), and `Inline`/`Wrap` when
 * overflow should wrap onto a new line (tag lists, breadcrumbs).
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
    props: HStackProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { align = 'center', ...rest } = props;
    return (
      <Flex
        direction="row"
        align={align}
        wrap={false}
        {...(rest as FlexProps<E>)}
        ref={forwardedRef}
      />
    );
  },
) as PolymorphicComponent<'div', HStackOwnProps>;

HStack.displayName = 'HStack';

export { HStack };
export type { HStackProps, HStackOwnProps };
