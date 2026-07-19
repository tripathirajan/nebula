import { useControllableState } from '@nebula/hooks';
import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { CarouselContext } from './carousel-context';

import type { CarouselOrientation } from './carousel-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface CarouselOwnProps {
  /** Total number of slides — known upfront by the consumer (unlike `Tree`'s dynamic nesting), so it's a plain prop rather than something `CarouselItem`s register themselves into. */
  count: number;
  /** Controlled: the current (0-indexed) slide. */
  index?: number;
  /** Uncontrolled: the initial (0-indexed) slide. @default 0 */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Whether `CarouselNext`/`CarouselPrevious` wrap past the first/last slide instead of disabling at the bounds. @default false */
  loop?: boolean;
  /** @default 'horizontal' */
  orientation?: CarouselOrientation;
}

type CarouselProps = PrimitivePropsWithRef<'div'> & CarouselOwnProps;

/**
 * Root of the Carousel compound component. No `@nebula/headless` layer
 * behind this one — a `react-ui`/`@nebula/hooks` project owner decision this
 * session (see `AGENTS.md`'s `react-ui` row): a carousel's complexity is
 * slide-index state plus a CSS transform, not an independent ARIA-behavior
 * layer worth decoupling from styling.
 *
 * Follows the WAI-ARIA APG's
 * [Carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/):
 * `role="region"` + `aria-roledescription="carousel"` on the root, each
 * `CarouselItem` is `role="group"` + `aria-roledescription="slide"` with an
 * `aria-label` announcing its position — no built-in autoplay (autoplay
 * carousels are a well-documented a11y anti-pattern unless they're pausable
 * and default-off, which is squarely a consumer-level decision, not
 * something to bake in here).
 *
 * @example
 * ```tsx
 * <Carousel count={slides.length} aria-label="Featured products">
 *   <CarouselContent>
 *     {slides.map((slide, i) => <CarouselItem key={slide.id} index={i}>{slide.content}</CarouselItem>)}
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 *   <CarouselIndicators />
 * </Carousel>
 * ```
 */
const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>((props, forwardedRef) => {
  const {
    className,
    count,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    loop = false,
    orientation = 'horizontal',
    'aria-label': ariaLabel,
    ...rest
  } = props;

  const [index, setIndex] = useControllableState<number>({
    prop: indexProp,
    defaultProp: defaultIndex,
    onChange: onIndexChange,
  });

  const clampedSetIndex = React.useCallback(
    (next: number) => {
      if (count <= 0) return;
      const wrapped = ((next % count) + count) % count;
      setIndex(wrapped);
    },
    [count, setIndex],
  );

  const contextValue = React.useMemo(
    () => ({ index: index ?? defaultIndex, setIndex: clampedSetIndex, count, loop, orientation }),
    [index, defaultIndex, clampedSetIndex, count, loop, orientation],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <Primitive
        as="div"
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel ?? 'Carousel'}
        data-orientation={orientation}
        // Vertical mode needs a real height in this box, not just on
        // `CarouselContent`: a percentage height (`CarouselContent`'s
        // `h-full`) only resolves against an ancestor with a *definite*
        // height per the CSS spec — without this, this root stays
        // `height: auto` (shrinks to fit all stacked slides), so
        // `CarouselContent`'s `overflow-hidden` never actually has anything
        // to clip and every slide renders fully visible at once.
        className={cn('relative', orientation === 'vertical' && 'h-full', className)}
        {...rest}
        ref={forwardedRef}
      />
    </CarouselContext.Provider>
  );
});

Carousel.displayName = 'Carousel';

export { Carousel };
export type { CarouselProps };
