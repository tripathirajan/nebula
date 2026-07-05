import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/** Props accepted by {@link Pre}. */
type PreProps<E extends React.ElementType = 'pre'> = PolymorphicComponentPropsWithRef<E>;

/**
 * A multi-line code block container — monospace, padded, horizontally
 * scrollable instead of wrapping/overflowing. Nest a `Code` inside for the
 * native `<pre><code>` structure (or plain text/a syntax highlighter's
 * output).
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
    const { as, className, ...rest } = props;
    return (
      <Primitive
        as={as ?? ('pre' as E)}
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        className={cn('overflow-x-auto rounded-md bg-gray-100 p-4 font-mono text-sm', className)}
      />
    );
  },
) as PolymorphicComponent<'pre'>;

Pre.displayName = 'Pre';

export { Pre };
export type { PreProps };
