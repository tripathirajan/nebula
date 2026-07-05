import * as React from 'react';

import { Flex } from '../flex/flex';

import type { FlexAlign, FlexJustify, FlexProps } from '../flex/flex';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

interface InlineOwnProps {
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: number | string;
  /** @default true */
  wrap?: boolean;
}

/** Props accepted by {@link Inline}. */
type InlineProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  E,
  InlineOwnProps
>;

/**
 * `Flex` pinned to `direction="row"` with `wrap` on by default and
 * `align="center"` — a horizontal run of children (tag lists, button
 * groups, breadcrumbs) that wraps onto multiple lines instead of
 * overflowing when it runs out of room.
 *
 * @example
 * ```tsx
 * <Inline gap={8}>
 *   <Badge>React</Badge>
 *   <Badge>TypeScript</Badge>
 *   <Badge>Tailwind</Badge>
 * </Inline>
 * ```
 */
const Inline = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: InlineProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { wrap = true, align = 'center', ...rest } = props;
    return (
      <Flex
        direction="row"
        wrap={wrap}
        align={align}
        {...(rest as FlexProps<E>)}
        ref={forwardedRef}
      />
    );
  },
) as PolymorphicComponent<'div', InlineOwnProps>;

Inline.displayName = 'Inline';

export { Inline };
export type { InlineProps };
