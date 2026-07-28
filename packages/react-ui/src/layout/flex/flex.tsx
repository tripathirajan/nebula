import { Flex as PrimitiveFlex } from '@nebula-lab/primitives/flex';
import * as React from 'react';

import type { FlexProps as PrimitiveFlexProps } from '@nebula-lab/primitives/flex';

/**
 * Styled `Flex` — a thin re-export of `@nebula-lab/primitives`' unstyled
 * `Flex` (`direction`/`align`/`justify`/`wrap`/`gap` convenience props
 * instead of hand-written Tailwind flex classes). Purely structural, no
 * color/token opinion of its own, so there's nothing this layer adds
 * beyond re-exporting under `@nebula-lab/react-ui` alongside every other
 * styled component, for one consistent import source.
 *
 * @example
 * ```tsx
 * <Flex direction="column" gap={12}>
 *   <Card />
 *   <Card />
 * </Flex>
 * ```
 */
const Flex = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveFlexProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveFlex {...(props as PrimitiveFlexProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveFlex;

Flex.displayName = 'Flex';

export { Flex };
export type { PrimitiveFlexProps as FlexProps };
