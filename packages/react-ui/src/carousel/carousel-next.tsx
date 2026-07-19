import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useCarouselContext } from './carousel-context';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type CarouselNextProps = PrimitivePropsWithRef<'button'>;

/** A round icon button — disabled at the last slide unless `Carousel`'s `loop` is set. Orientation-aware: points right/sits on the trailing edge in a horizontal carousel, points down/sits on the bottom edge in a vertical one. */
const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  (props, forwardedRef) => {
    const { className, onClick, disabled: disabledProp, children, ...rest } = props;
    const context = useCarouselContext('CarouselNext');
    const disabled = disabledProp || (!context.loop && context.index === context.count - 1);
    const vertical = context.orientation === 'vertical';

    return (
      <Primitive
        as="button"
        type="button"
        aria-label="Next slide"
        disabled={disabled}
        className={cn(
          'absolute z-[var(--z-local)] flex h-8 w-8 items-center justify-center rounded-full border border-[var(--carousel-nav-border)] bg-[var(--carousel-nav-bg)] text-[var(--carousel-nav-text)] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carousel-indicator-active-bg)] disabled:cursor-not-allowed disabled:opacity-40',
          vertical ? 'bottom-2 left-1/2 -translate-x-1/2' : 'right-2 top-1/2 -translate-y-1/2',
          className,
        )}
        {...rest}
        ref={forwardedRef}
        onClick={(event) => {
          onClick?.(event);
          if (!disabled) context.setIndex(context.index + 1);
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
            <path d={vertical ? 'm6 9 6 6 6-6' : 'm9 18 6-6-6-6'} />
          </svg>
        )}
      </Primitive>
    );
  },
);

CarouselNext.displayName = 'CarouselNext';

export { CarouselNext };
export type { CarouselNextProps };
