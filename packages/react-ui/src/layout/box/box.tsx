import { Box as PrimitiveBox } from '@nebula-lab/primitives/box';
import * as React from 'react';

import type { BoxProps as PrimitiveBoxProps } from '@nebula-lab/primitives/box';

/**
 * Styled `Box` — thin re-export of `@nebula-lab/primitives`' `Box`, the
 * plainest possible polymorphic building block (a `Primitive` by another
 * name, zero injected classes or structural opinion). Reach for `Flex`/
 * `Grid`/`Stack` instead when you want a *specific* layout behavior out of
 * the box, and for `Box` when you just need "a polymorphic element I'll
 * style myself."
 *
 * @example
 * ```tsx
 * <Box className="rounded-[var(--radius-box)] border border-[var(--card-border)] p-4">
 *   Plain container, styled entirely via className.
 * </Box>
 *
 * // Polymorphic like every other Nebula component:
 * <Box as="section" aria-label="Summary">...</Box>
 * ```
 */
const Box = React.forwardRef(
  <E extends React.ElementType = 'div'>(props: PrimitiveBoxProps<E>, forwardedRef: React.Ref<unknown>) => {
    return <PrimitiveBox {...(props as PrimitiveBoxProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveBox;

Box.displayName = 'Box';

export { Box };
export type { PrimitiveBoxProps as BoxProps };
