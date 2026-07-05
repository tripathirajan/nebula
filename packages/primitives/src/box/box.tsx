import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/** Props accepted by {@link Box}. Carries no opinions of its own — see the component doc. */
type BoxProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<E>;

/**
 * The plainest possible polymorphic building block — a `Primitive` by
 * another name. `Box` renders a `div` (or whatever `as`/`asChild` says) with
 * zero injected classes or structural opinion; reach for `Flex`/`Grid`/
 * `Stack` instead when you want a *specific* layout behavior out of the box,
 * and for `Box` when you just need "a polymorphic element I'll style myself."
 *
 * @example
 * ```tsx
 * <Box className="rounded-lg border p-4">
 *   Plain container, styled entirely via className.
 * </Box>
 *
 * // Polymorphic like every other Nebula primitive:
 * <Box as="section" aria-label="Summary">...</Box>
 * ```
 */
const Box = React.forwardRef(
  <E extends React.ElementType = 'div'>(props: BoxProps<E>, forwardedRef: React.Ref<unknown>) => {
    return <Primitive {...props} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'div'>;

Box.displayName = 'Box';

export { Box };
export type { BoxProps };
