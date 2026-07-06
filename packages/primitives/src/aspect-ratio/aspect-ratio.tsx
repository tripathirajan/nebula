import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

interface AspectRatioOwnProps {
  /**
   * `width / height`, e.g. `16 / 9` or `1` for a square. Applied via the
   * CSS `aspect-ratio` property (broadly supported; no padding-percentage
   * fallback here — add one at the call site via `style` if you need to
   * support browsers old enough to lack it).
   * @default 1
   */
  ratio?: number;
}

/** Props accepted by {@link AspectRatio}. */
type AspectRatioProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  E,
  AspectRatioOwnProps
>;

/**
 * Constrains its content to a fixed width/height ratio regardless of the
 * content's own intrinsic size — for video/image/chart containers where
 * the layout shouldn't jump as content loads.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/hero.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
 * </AspectRatio>
 * ```
 */
const AspectRatio = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: AspectRatioProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { ratio = 1, style, ...rest } = props;
    return (
      <Primitive
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        style={{ ...style, aspectRatio: ratio }}
      />
    );
  },
) as PolymorphicComponent<'div', AspectRatioOwnProps>;

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
export type { AspectRatioProps, AspectRatioOwnProps };
