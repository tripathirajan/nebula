import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useCarouselContext } from './carousel-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface CarouselItemOwnProps {
  /** This slide's position (0-indexed) — supplied by the consumer, same convention `StepperItem`'s `index` prop uses, since a carousel's slide count/order is known upfront rather than discovered via mount-time registration. */
  index: number;
}

type CarouselItemProps = PrimitivePropsWithRef<'div'> & CarouselItemOwnProps;

/** `role="group"` + `aria-roledescription="slide"` per the WAI-ARIA Carousel pattern — `aria-label` announces this slide's position (`"2 of 5"`), read from `Carousel`'s `count`. */
const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>((props, forwardedRef) => {
  const { className, index, 'aria-label': ariaLabel, ...rest } = props;
  const context = useCarouselContext('CarouselItem');

  return (
    <Primitive
      as="div"
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel ?? `${index + 1} of ${context.count}`}
      aria-hidden={context.index !== index}
      data-state={context.index === index ? 'active' : 'inactive'}
      className={cn('shrink-0', context.orientation === 'vertical' ? 'h-full' : 'w-full', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

CarouselItem.displayName = 'CarouselItem';

export { CarouselItem };
export type { CarouselItemProps };
