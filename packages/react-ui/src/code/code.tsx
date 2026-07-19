import { cn } from '@nebula-lab/primitives/cn';
import { Code as PrimitiveCode } from '@nebula-lab/primitives/code';
import * as React from 'react';

import type { CodeProps as PrimitiveCodeProps } from '@nebula-lab/primitives/code';
import type { PolymorphicComponent } from '@nebula-lab/primitives/types';

/**
 * Styled inline `Code` — overrides the unstyled primitive's hardcoded
 * `bg-gray-100` (a pre-token-system leftover, not yet themed at that layer)
 * with `--code-bg`/`-text` (see `../tokens/component.ts`); `cn()`'s
 * `tailwind-merge` dedupes the conflicting `bg-*` class so only this
 * layer's themed one survives regardless of import order.
 *
 * @example
 * ```tsx
 * <Text>Run <Code>pnpm install</Code> from the repo root.</Text>
 * ```
 */
const Code = React.forwardRef(
  <E extends React.ElementType = 'code'>(
    props: PrimitiveCodeProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { className, ...rest } = props;
    return (
      <PrimitiveCode
        className={cn('rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-sm text-[var(--code-text)]', className)}
        {...(rest as PrimitiveCodeProps<E>)}
        ref={forwardedRef}
      />
    );
  },
) as PolymorphicComponent<'code'>;

Code.displayName = 'Code';

export { Code };
export type { PrimitiveCodeProps as CodeProps };
