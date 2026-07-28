import { cn } from '@nebula-lab/primitives/cn';
import { Code as PrimitiveCode } from '@nebula-lab/primitives/code';
import * as React from 'react';

import type { CodeProps as PrimitiveCodeProps } from '@nebula-lab/primitives/code';
import type { PolymorphicComponent } from '@nebula-lab/primitives/types';

/**
 * Styled inline `Code` — the unstyled primitive carries no classes of its
 * own (unstyled primitives own behavior, not visuals), so this layer is the
 * sole source of the monospace/pill-background look, via `--code-bg`/`-text`
 * (see `../tokens/component.ts`).
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
