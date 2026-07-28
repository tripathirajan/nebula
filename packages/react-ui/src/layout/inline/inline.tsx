import { Inline as PrimitiveInline } from '@nebula-lab/primitives/inline';
import * as React from 'react';

import type { InlineProps as PrimitiveInlineProps } from '@nebula-lab/primitives/inline';

/**
 * Styled `Inline` — thin re-export of `@nebula-lab/primitives`' `Flex`
 * pinned to a horizontal row that wraps (tag lists, button groups,
 * breadcrumbs) instead of overflowing.
 *
 * @example
 * ```tsx
 * <Inline gap={8}>
 *   <Badge>React</Badge>
 *   <Badge>TypeScript</Badge>
 * </Inline>
 * ```
 */
const Inline = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveInlineProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveInline {...(props as PrimitiveInlineProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveInline;

Inline.displayName = 'Inline';

export { Inline };
export type { PrimitiveInlineProps as InlineProps };
