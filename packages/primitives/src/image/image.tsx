
import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';


/** Props accepted by {@link Image}. */
type ImageProps<E extends React.ElementType = 'img'> = PolymorphicComponentPropsWithRef<E>;

/**
 * An unstyled `img` — exists so `image` has the same polymorphic `as`/
 * `asChild` escape hatches (framework image components, `next/image`, a
 * `<picture>` wrapper, ...) as every other Nebula element primitive,
 * instead of consumers reaching for a bare `<img>` that can't compose the
 * same way. Deliberately does not add load/error-state tracking — that's
 * `react-ui`'s `Avatar`/`AvatarImage`'s job (a specific, opinionated
 * fallback pattern), not a bare unstyled primitive's.
 *
 * Always pass `alt` — an empty string (`alt=""`) if the image is purely
 * decorative, never omit it.
 *
 * @example
 * ```tsx
 * <Image src="/hero.png" alt="Product screenshot" />
 *
 * // Framework image component integration:
 * <Image as={NextImage} src="/hero.png" alt="Product screenshot" width={800} height={400} />
 * ```
 */
const Image = React.forwardRef(
  <E extends React.ElementType = 'img'>(props: ImageProps<E>, forwardedRef: React.Ref<unknown>) => {
    const { as, ...rest } = props;
    return <Primitive as={as ?? ('img' as E)} {...(rest as PrimitiveProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'img'>;

Image.displayName = 'Image';

export { Image };
export type { ImageProps };
