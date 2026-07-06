import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useCarouselContext } from './carousel-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type CarouselContentProps = PrimitivePropsWithRef<'div'>;

/**
 * The clipping viewport around the slide track — `CarouselItem`s are the
 * track's flex children, each `shrink-0 w-full` (or `h-full` when vertical),
 * and the whole track translates by `-index * 100%` via an inline `style`
 * (a CSS transform, not scroll position, so `CarouselPrevious`/`Next`'s
 * click-driven navigation doesn't fight a user's own scroll gesture — a
 * deliberately simpler model than a scroll-snap-based carousel, which would
 * need its own scroll-position-to-index sync logic).
 */
const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    const context = useCarouselContext('CarouselContent');
    const vertical = context.orientation === 'vertical';

    return (
      <Primitive
        as="div"
        className={cn('overflow-hidden', className)}
        {...rest}
        ref={forwardedRef}
      >
        <div
          className={cn(
            'flex transition-transform duration-300 ease-in-out',
            vertical ? 'flex-col' : 'flex-row',
          )}
          style={{
            transform: vertical
              ? `translateY(-${context.index * 100}%)`
              : `translateX(-${context.index * 100}%)`,
          }}
        >
          {children}
        </div>
      </Primitive>
    );
  },
);

CarouselContent.displayName = 'CarouselContent';

export { CarouselContent };
export type { CarouselContentProps };
