import { cn } from '@nebula-lab/primitives/cn';
import { Image as PrimitiveImage } from '@nebula-lab/primitives/image';
import * as React from 'react';

import type { ImageProps as PrimitiveImageProps } from '@nebula-lab/primitives/image';
import type { PolymorphicComponent } from '@nebula-lab/primitives/types';

/**
 * Styled `Image` — wraps `@nebula-lab/primitives`' unstyled `Image` and
 * adds `display: block` (an `<img>` is inline by default, which leaves a
 * few px of baseline gap under it inside a flex/block container — a
 * common, easy-to-miss layout bug) plus a `max-w-full` responsive default.
 * No load/error-state tracking here — that's `Avatar`/`AvatarImage`'s job.
 *
 * Always pass `alt` — an empty string (`alt=""`) if the image is purely
 * decorative, never omit it.
 *
 * @example
 * ```tsx
 * <Image src="/hero.png" alt="Product screenshot" className="rounded-[var(--radius-card)]" />
 * ```
 */
const Image = React.forwardRef(
  <E extends React.ElementType = 'img'>(
    props: PrimitiveImageProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { className, ...rest } = props;
    return (
      <PrimitiveImage
        className={cn('block max-w-full', className)}
        {...(rest as PrimitiveImageProps<E>)}
        ref={forwardedRef}
      />
    );
  },
) as PolymorphicComponent<'img'>;

Image.displayName = 'Image';

export { Image };
export type { PrimitiveImageProps as ImageProps };
