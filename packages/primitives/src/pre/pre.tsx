import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/** Props accepted by {@link Pre}. */
type PreProps<E extends React.ElementType = 'pre'> = PolymorphicComponentPropsWithRef<E>;

/**
 * A multi-line code block container — a `pre` by another name, no classes
 * of its own (unstyled primitives own behavior, not visuals —
 * `@nebula-lab/react-ui`'s `Pre` supplies the monospace/padding/scroll/
 * background styling). Nest a `Code` inside for the native `<pre><code>`
 * structure (or plain text/a syntax highlighter's output).
 *
 * @example
 * ```tsx
 * <Pre>
 *   <Code>{`function greet() {\n  return 'hi';\n}`}</Code>
 * </Pre>
 * ```
 */
const Pre = React.forwardRef(
  <E extends React.ElementType = 'pre'>(props: PreProps<E>, forwardedRef: React.Ref<unknown>) => {
    const { as, ...rest } = props;
    return <Primitive as={as ?? ('pre' as E)} {...(rest as PrimitiveProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'pre'>;

Pre.displayName = 'Pre';

export { Pre };
export type { PreProps };
