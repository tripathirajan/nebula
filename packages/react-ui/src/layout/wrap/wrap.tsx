import { Wrap as PrimitiveWrap } from '@nebula-lab/primitives/wrap';
import * as React from 'react';

import type { WrapProps as PrimitiveWrapProps } from '@nebula-lab/primitives/wrap';

/**
 * Styled `Wrap` — alias of `Inline` under a name consumers coming from
 * other component libraries reach for first. Thin re-export; see `Flex`'s own doc comment
 * for why this layer adds nothing beyond re-exporting.
 *
 * @example
 * ```tsx
 * <Wrap gap={8}>
 *   <Badge>React</Badge>
 *   <Badge>TypeScript</Badge>
 * </Wrap>
 * ```
 */
const Wrap = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveWrapProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveWrap {...(props as PrimitiveWrapProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveWrap;

Wrap.displayName = 'Wrap';

export { Wrap };
export type { PrimitiveWrapProps as WrapProps };
