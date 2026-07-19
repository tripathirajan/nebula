import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useCarouselContext } from './carousel-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface CarouselIndicatorsOwnProps {
  /**
   * `true` (the default) absolutely positions the dot row over the trailing
   * edge of the slide, matching how a full-bleed image carousel usually
   * wants it. Set `false` to render in normal document flow instead — no
   * position/inset classes at all, just the flex dot row — for a layout
   * where the dots must never overlap the card (e.g. sitting in their own
   * row underneath it, which is the caller's own layout to build).
   */
  overlay?: boolean;
}

type CarouselIndicatorsProps = PrimitivePropsWithRef<'div'> & CarouselIndicatorsOwnProps;

/**
 * Renders `count` dot buttons directly, one per slide — no separate
 * `CarouselIndicator` sub-component/export, since a dot's only job is "jump
 * to this index," which needs nothing from the consumer beyond which index
 * it is (same "just render it inline" call `CommandGroup` makes for its
 * `heading` rather than a separate sub-component).
 */
const CarouselIndicators = React.forwardRef<HTMLDivElement, CarouselIndicatorsProps>(
  (props, forwardedRef) => {
    const { className, overlay = true, ...rest } = props;
    const context = useCarouselContext('CarouselIndicators');
    const vertical = context.orientation === 'vertical';

    return (
      <Primitive
        as="div"
        role="tablist"
        aria-label="Slides"
        aria-orientation={context.orientation}
        className={cn(
          'flex gap-1.5',
          overlay
            ? cn(
                'absolute z-[var(--z-local)]',
                vertical ? 'right-2 top-1/2 -translate-y-1/2 flex-col' : 'bottom-2 left-1/2 -translate-x-1/2',
              )
            : cn('justify-center', vertical && 'flex-col'),
          className,
        )}
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
