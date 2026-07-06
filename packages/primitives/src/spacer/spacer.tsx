
import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';


interface SpacerOwnProps {
  /**
   * Flex-grow (and flex-shrink) factor — how aggressively this element
   * claims the remaining free space relative to any other `Spacer`s in the
   * same flex container. `flex-basis` is fixed at `0%` so the grow factor
   * is the only thing that matters, matching the usual "distribute the
   * leftover space" mental model.
   * @default 1
   */
  grow?: number;
}

/** Props accepted by {@link Spacer}. */
type SpacerProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  E,
  SpacerOwnProps
>;

/**
 * An invisible, `flex-grow`ing filler — drop it between two children of a
 * `Flex`/`HStack`/`Inline` to push them to opposite ends without hand-
 * writing `justify="between"` (useful when there are more than two
 * children and only *some* of the gaps should expand). Purely a layout
 * device with no visible content, so it's `aria-hidden` by default.
 *
 * @example
 * ```tsx
 * <HStack>
 *   <Logo />
 *   <Spacer />
 *   <Button>Sign out</Button>
 * </HStack>
 * ```
 */
const Spacer = React.forwardRef(
  <E extends React.ElementType = 'div'>(props: SpacerProps<E>, forwardedRef: React.Ref<unknown>) => {
    const { grow = 1, style, ...rest } = props;

    return (
      <Primitive
        aria-hidden
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        style={{ flexGrow: grow, flexShrink: grow, flexBasis: '0%', ...style }}
      />
    );
  },
) as PolymorphicComponent<'div', SpacerOwnProps>;

Spacer.displayName = 'Spacer';

export { Spacer };
export type { SpacerProps, SpacerOwnProps };
