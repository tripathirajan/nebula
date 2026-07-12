import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useCarouselContext } from './carousel-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type CarouselNextProps = PrimitivePropsWithRef<'button'>;

/** A round icon button — disabled at the last slide unless `Carousel`'s `loop` is set. */
const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  (props, forwardedRef) => {
    const { className, onClick, disabled: disabledProp, children, ...rest } = props;
    const context = useCarouselContext('CarouselNext');
    const disabled = disabledProp || (!context.loop && context.index === context.count - 1);

    return (
      <Primitive
        as="button"
        type="button"
        aria-label="Next slide"
        disabled={disabled}
        className={cn(
          'absolute right-2 top-1/2 z-[var(--z-local)] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--carousel-nav-border)] bg-[var(--carousel-nav-bg)] text-[var(--carousel-nav-text)] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carousel-indicator-active-bg)] disabled:cursor-not-allowed disabled:opacity-40',
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </Primitive>
    );
  },
);

CarouselNext.displayName = 'CarouselNext';

export { CarouselNext };
export type { CarouselNextProps };
