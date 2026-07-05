import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/** Props accepted by {@link Code}. */
type CodeProps<E extends React.ElementType = 'code'> = PolymorphicComponentPropsWithRef<E>;

/**
 * Inline code — monospace font in a subtle pill background. For multi-line
 * code blocks, wrap this in `Pre` (`<Pre><Code>...</Code></Pre>`), matching
 * the native `<pre><code>` nesting.
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
    const { as, className, ...rest } = props;
    return (
      <Primitive
        as={as ?? ('code' as E)}
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        className={cn('rounded bg-gray-100 px-1 py-0.5 font-mono text-sm', className)}
      />
    );
  },
) as PolymorphicComponent<'code'>;

Code.displayName = 'Code';

export { Code };
export type { CodeProps };
