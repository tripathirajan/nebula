import { Rating as HeadlessRating } from '@nebula/headless/rating';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { RatingProps as HeadlessRatingProps } from '@nebula/headless/rating';

type RatingProps = HeadlessRatingProps;

const Rating = React.forwardRef<HTMLDivElement, RatingProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessRating
      className={cn('inline-flex items-center gap-1', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Rating.displayName = 'Rating';

export { Rating };
export type { RatingProps };
