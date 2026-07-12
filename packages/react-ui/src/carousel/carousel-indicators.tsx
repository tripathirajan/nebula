import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useCarouselContext } from './carousel-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type CarouselIndicatorsProps = PrimitivePropsWithRef<'div'>;

/**
 * Renders `count` dot buttons directly, one per slide — no separate
 * `CarouselIndicator` sub-component/export, since a dot's only job is "jump
 * to this index," which needs nothing from the consumer beyond which index
 * it is (same "just render it inline" call `CommandGroup` makes for its
 * `heading` rather than a separate sub-component).
 */
const CarouselIndicators = React.forwardRef<HTMLDivElement, CarouselIndicatorsProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    const context = useCarouselContext('CarouselIndicators');

    return (
      <Primitive
        as="div"
        role="tablist"
        aria-label="Slides"
        className={cn('absolute bottom-2 left-1/2 z-[var(--z-local)] flex -translate-x-1/2 gap-1.5', className)}
        {...rest}
        ref={forwardedRef}
      >
        {Array.from({ length: context.count }, (_, dotIndex) => {
          const active = context.index === dotIndex;
          return (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Go to slide ${dotIndex + 1}`}
              onClick={() => context.setIndex(dotIndex)}
              className={cn(
                'h-2 w-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carousel-indicator-active-bg)]',
                active
                  ? 'bg-[var(--carousel-indicator-active-bg)]'
                  : 'bg-[var(--carousel-indicator-bg)]',
              )}
            />
          );
        })}
      </Primitive>
    );
  },
);

CarouselIndicators.displayName = 'CarouselIndicators';

export { CarouselIndicators };
export type { CarouselIndicatorsProps };
