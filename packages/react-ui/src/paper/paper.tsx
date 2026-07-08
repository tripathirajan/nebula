import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';
import type { VariantProps } from 'class-variance-authority';

/**
 * Same two-axis shape `Card` uses (see `card.tsx`) — `variant="outlined"`
 * always renders a visible border and no shadow regardless of `elevation`;
 * `variant="elevation"` renders a shadow (depth controlled by `elevation`)
 * and no border. `elevation={0}` under the default `"elevation"` variant is
 * the flat/borderless look (no shadow, no border).
 */
const paperVariants = cva('rounded-[var(--radius-card)] bg-[var(--paper-bg)] text-[var(--paper-text)]', {
  variants: {
    variant: {
      elevation: 'border-0',
      outlined: 'border border-[var(--paper-border)] shadow-none',
    },
    elevation: {
      0: 'shadow-none',
      1: 'shadow-sm',
      2: 'shadow-md',
      3: 'shadow-lg',
    },
  },
  compoundVariants: [
    { variant: 'outlined', elevation: [0, 1, 2, 3], class: 'shadow-none' },
  ],
  defaultVariants: { variant: 'elevation', elevation: 1 },
});

type PaperProps = PrimitivePropsWithRef<'div'> & VariantProps<typeof paperVariants>;

/**
 * A bordered or elevated surface for arbitrary content — like `Card`, but
 * without `Card`'s compound header/title/content/footer sub-parts: reach
 * for `Paper` for a generic raised panel (a floating toolbar, a custom
 * layout that doesn't fit `Card`'s title+body shape), and `Card` for
 * anything that actually wants that title/description/footer structure.
 *
 * `variant="outlined"` gives a visible border and no shadow; the default
 * `variant="elevation"` gives a shadow (depth via `elevation`, 0-3) and no
 * border — `elevation={0}` is the flat, borderless look.
 *
 * @example
 * ```tsx
 * <Paper elevation={2} className="p-4">Custom panel content.</Paper>
 * <Paper variant="outlined" className="p-4">Bordered, no shadow.</Paper>
 * <Paper elevation={0} className="p-4">Flat, no border or shadow.</Paper>
 * ```
 */
const Paper = React.forwardRef<HTMLDivElement, PaperProps>((props, forwardedRef) => {
  const { className, variant, elevation, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn(paperVariants({ variant, elevation }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Paper.displayName = 'Paper';

export { Paper, paperVariants };
export type { PaperProps };
