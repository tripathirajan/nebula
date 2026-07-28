import { cn } from '@nebula-lab/primitives/cn';
import { Pre as PrimitivePre } from '@nebula-lab/primitives/pre';
import * as React from 'react';

import type { PreProps as PrimitivePreProps } from '@nebula-lab/primitives/pre';

/**
 * Styled `Pre` — wraps `@nebula-lab/primitives`' `Pre` (multi-line code
 * block container, monospace, horizontally scrollable). The primitive's own
 * background is a hardcoded gray (no theme/dark-mode opinion, by design —
 * `primitives` never carries color); this layer overrides it with the same
 * `--code-block-*` tokens `CodeBlock` uses, so a bare `<Pre><Code>...` block
 * (no copy button, no line numbers) still themes/dark-mode-switches
 * correctly instead of staying a fixed light-gray box.
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
          'rounded-[var(--radius-box)] border border-[var(--code-block-border)] bg-[var(--code-block-bg)]',
          className,
        )}
      />
    );
  },
) as typeof PrimitivePre;

Pre.displayName = 'Pre';

export { Pre };
export type { PrimitivePreProps as PreProps };
