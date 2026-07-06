import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

interface GridOwnProps {
  /**
   * Number of equal-width columns, or a raw `grid-template-columns` value
   * (e.g. `'200px 1fr 1fr'`) for anything more specific than an even split.
   */
  columns?: number | string;
  /** Same shape as `columns`, for row tracks. */
  rows?: number | string;
  /** Applied as an inline style — see `Flex`'s `gap` doc for why. */
  gap?: number | string;
}

/** Props accepted by {@link Grid}. */
type GridProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<E, GridOwnProps>;

/**
 * A `display: grid` container. `columns`/`rows` accept either a column/row
 * count (mapped to `repeat(n, minmax(0, 1fr))`) or a raw CSS track string.
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap={16}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 *
 * <Grid columns="200px 1fr" gap="1rem">
 *   <Sidebar />
 *   <Content />
 * </Grid>
 * ```
 */
const Grid = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: GridProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { columns, rows, gap, className, style, ...rest } = props;

    const gridTemplateColumns =
      typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;
    const gridTemplateRows = typeof rows === 'number' ? `repeat(${rows}, minmax(0, 1fr))` : rows;

    return (
      <Primitive
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        className={cn('grid', className)}
        style={{ ...style, gridTemplateColumns, gridTemplateRows, gap }}
      />
    );
  },
) as PolymorphicComponent<'div', GridOwnProps>;

Grid.displayName = 'Grid';

export { Grid };
export type { GridProps, GridOwnProps };
