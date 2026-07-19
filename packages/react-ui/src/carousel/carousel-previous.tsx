import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useCarouselContext } from './carousel-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type CarouselPreviousProps = PrimitivePropsWithRef<'button'>;

/** A round icon button — disabled at the first slide unless `Carousel`'s `loop` is set. Orientation-aware: points left/sits on the leading edge in a horizontal carousel, points up/sits on the top edge in a vertical one. */
const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  (props, forwardedRef) => {
    const { className, onClick, disabled: disabledProp, children, ...rest } = props;
    const context = useCarouselContext('CarouselPrevious');
    const disabled = disabledProp || (!context.loop && context.index === 0);
    const vertical = context.orientation === 'vertical';

    return (
      <Primitive
        as="button"
        type="button"
        aria-label="Previous slide"
        disabled={disabled}
        className={cn(
          'absolute z-[var(--z-local)] flex h-8 w-8 items-center justify-center rounded-full border border-[var(--carousel-nav-border)] bg-[var(--carousel-nav-bg)] text-[var(--carousel-nav-text)] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carousel-indicator-active-bg)] disabled:cursor-not-allowed disabled:opacity-40',
          vertical ? 'top-2 left-1/2 -translate-x-1/2' : 'left-2 top-1/2 -translate-y-1/2',
          className,
        )}
        {...rest}
        ref={forwardedRef}
        onClick={(event) => {
          onClick?.(event);
          if (!disabled) context.setIndex(context.index - 1);
        }}
      >
        {children ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d={vertical ? 'm18 15-6-6-6 6' : 'm15 18-6-6 6-6'} />
          </svg>
        )}
      </Primitive>
    );
  },
);

CarouselPrevious.displayName = 'CarouselPrevious';

export { CarouselPrevious };
export type { CarouselPreviousProps };
