import { Grid as PrimitiveGrid } from '@nebula-lab/primitives/grid';
import * as React from 'react';

import type { GridProps as PrimitiveGridProps } from '@nebula-lab/primitives/grid';

/**
 * Styled `Grid` — thin re-export of `@nebula-lab/primitives`' `Grid`.
 * `columns`/`rows` accept a track count (mapped to `repeat(n, minmax(0,
 * 1fr))`) or a raw CSS track string.
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap={16}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 * ```
 */
const Grid = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveGridProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveGrid {...(props as PrimitiveGridProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveGrid;

Grid.displayName = 'Grid';

export { Grid };
export type { PrimitiveGridProps as GridProps };
