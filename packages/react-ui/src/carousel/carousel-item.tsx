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

/**
 * `role="group"` + `aria-roledescription="slide"` per the WAI-ARIA Carousel
 * pattern — `aria-label` announces this slide's position (`"2 of 5"`), read
 * from `Carousel`'s `count`. Inactive slides also get `inert`: `aria-hidden`
 * alone hides content from assistive tech but does *not* remove focusable
 * descendants (links/buttons) from the tab order, so a sighted keyboard user
 * could tab into an invisible off-screen slide — a real WCAG violation once a
 * slide holds any interactive content. `inert` (React 19+, baseline browser
 * support) removes the whole subtree from both focus and the AT tree in one
 * attribute, so `aria-hidden` becomes redundant but is kept for older AT.
 */
const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>((props, forwardedRef) => {
  const { className, index, 'aria-label': ariaLabel, ...rest } = props;
  const context = useCarouselContext('CarouselItem');
  const inactive = context.index !== index;

  return (
    <Primitive
      as="div"
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel ?? `${index + 1} of ${context.count}`}
      aria-hidden={inactive}
      inert={inactive}
      data-state={inactive ? 'inactive' : 'active'}
      className={cn('shrink-0', context.orientation === 'vertical' ? 'h-full' : 'w-full', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

CarouselItem.displayName = 'CarouselItem';

export { CarouselItem };
export type { CarouselItemProps };
