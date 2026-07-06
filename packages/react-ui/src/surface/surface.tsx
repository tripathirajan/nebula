import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type SurfaceProps = PrimitivePropsWithRef<'div'>;

/**
 * The plainest possible themed background — just `--surface-bg`/`-text`,
 * no border/shadow/radius at all (unlike `Paper`/`Card`). Use this when you
 * only need to visually separate a region from the page background (e.g. a
 * `base-200` panel against a `base-100` page), not to imply elevation or
 * frame a bordered card.
 *
 * @example
 * ```tsx
 * <Surface className="p-4">Muted panel content.</Surface>
 * ```
 */
const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn('bg-[var(--surface-bg)] text-[var(--surface-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Surface.displayName = 'Surface';

export { Surface };
export type { SurfaceProps };
