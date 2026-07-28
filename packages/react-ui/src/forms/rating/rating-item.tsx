import { RatingItem as HeadlessRatingItem } from '@nebula-lab/headless/rating';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { RatingItemProps as HeadlessRatingItemProps } from '@nebula-lab/headless/rating';

type RatingItemProps = HeadlessRatingItemProps;

/** Renders a built-in filled/outline star by default (toggled purely off the headless source's `data-state`), same "no icon dependency" approach `AccordionTrigger`'s chevron uses — pass `children` to swap in a different icon entirely. */
const RatingItem = React.forwardRef<HTMLButtonElement, RatingItemProps>((props, forwardedRef) => {
  const { className, children, ...rest } = props;
  return (
    <HeadlessRatingItem
      className={cn(
        'cursor-pointer text-[var(--rating-empty)] outline-none transition-colors data-[state=filled]:text-[var(--rating-filled)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    >
      {children ?? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
        </svg>
      )}
    </HeadlessRatingItem>
  );
});

RatingItem.displayName = 'RatingItem';

export { RatingItem };
export type { RatingItemProps };
