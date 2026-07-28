import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/** Props accepted by {@link Code}. */
type CodeProps<E extends React.ElementType = 'code'> = PolymorphicComponentPropsWithRef<E>;

/**
 * Inline code — a `code` by another name, no classes of its own (unstyled
 * primitives own behavior, not visuals — `@nebula-lab/react-ui`'s `Code`
 * supplies the monospace/background/pill styling). For multi-line code
 * blocks, wrap this in `Pre` (`<Pre><Code>...</Code></Pre>`), matching the
 * native `<pre><code>` nesting.
 *
 * @example
 * ```tsx
 * <Text>Run <Code>pnpm install</Code> from the repo root.</Text>
 * ```
 */
const Code = React.forwardRef(
  <E extends React.ElementType = 'code'>(
    props: CodeProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { as, ...rest } = props;
    return <Primitive as={as ?? ('code' as E)} {...(rest as PrimitiveProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'code'>;

Code.displayName = 'Code';

export { Code };
export type { CodeProps };
