import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface PaperOwnProps {
  /** Shadow depth. @default 1 */
  elevation?: 0 | 1 | 2 | 3;
}

type PaperProps = PrimitivePropsWithRef<'div'> & PaperOwnProps;

const ELEVATION_SHADOW = {
  0: 'shadow-none',
  1: 'shadow-sm',
  2: 'shadow-md',
  3: 'shadow-lg',
} as const;

/**
 * A bordered, elevated surface for arbitrary content — like `Card`, but
 * without `Card`'s compound header/title/content/footer sub-parts: reach
 * for `Paper` for a generic raised panel (a floating toolbar, a custom
 * layout that doesn't fit `Card`'s title+body shape), and `Card` for
 * anything that actually wants that title/description/footer structure.
 * `elevation` only controls shadow depth — border/radius/background stay
 * fixed regardless, so raising/lowering elevation never changes the shape.
 *
 * @example
 * ```tsx
 * <Paper elevation={2} className="p-4">
 *   Custom panel content.
 * </Paper>
 * ```
 */
const Paper = React.forwardRef<HTMLDivElement, PaperProps>((props, forwardedRef) => {
  const { className, elevation = 1, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn(
        'rounded-[var(--radius-card)] border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-text)]',
        ELEVATION_SHADOW[elevation],
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Paper.displayName = 'Paper';

export { Paper };
export type { PaperProps };
