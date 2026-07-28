import { AspectRatio as PrimitiveAspectRatio } from '@nebula-lab/primitives/aspect-ratio';
import * as React from 'react';

import type { AspectRatioProps as PrimitiveAspectRatioProps } from '@nebula-lab/primitives/aspect-ratio';

/**
 * Styled `AspectRatio` — thin re-export of `@nebula-lab/primitives`'
 * `AspectRatio`, constraining content to a fixed width/height ratio
 * regardless of its own intrinsic size (video/image/chart containers).
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <Image src="/hero.jpg" alt="" className="h-full w-full object-cover" />
 * </AspectRatio>
 * ```
 */
const AspectRatio = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveAspectRatioProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveAspectRatio {...(props as PrimitiveAspectRatioProps<E>)} ref={forwardedRef} />;
  },
) as typeof PrimitiveAspectRatio;

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
export type { PrimitiveAspectRatioProps as AspectRatioProps };
