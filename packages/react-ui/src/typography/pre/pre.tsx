import { cn } from '@nebula-lab/primitives/cn';
import { Pre as PrimitivePre } from '@nebula-lab/primitives/pre';
import * as React from 'react';

import type { PreProps as PrimitivePreProps } from '@nebula-lab/primitives/pre';

/**
 * Styled `Pre` — the unstyled primitive carries no classes of its own
 * (unstyled primitives own behavior, not visuals), so this layer is the sole
 * source of the monospace/padding/scroll/background look — the same
 * `--code-block-*` tokens `CodeBlock` uses, so a bare `<Pre><Code>...>` block
 * (no copy button, no line numbers) still themes/dark-mode-switches
 * correctly.
 *
 * @example
 * ```tsx
 * <Pre>
 *   <Code>{`function greet() {\n  return 'hi';\n}`}</Code>
 * </Pre>
 * ```
 */
const Pre = React.forwardRef(
  <E extends React.ElementType = 'pre'>(props: PrimitivePreProps<E>, forwardedRef: React.Ref<unknown>) => {
    const { className, ...rest } = props;
    return (
      <PrimitivePre
        {...(rest as PrimitivePreProps<E>)}
        ref={forwardedRef}
        className={cn(
          'overflow-x-auto rounded-[var(--radius-box)] border border-[var(--code-block-border)] bg-[var(--code-block-bg)] p-4 font-mono text-sm',
          className,
        )}
      />
    );
  },
) as typeof PrimitivePre;

Pre.displayName = 'Pre';

export { Pre };
export type { PrimitivePreProps as PreProps };
