import { cn } from '@nebula/primitives/cn';
import { Rating as StylelessRating } from '@nebula/styleless/rating';
import * as React from 'react';

import type { RatingProps as StylelessRatingProps } from '@nebula/styleless/rating';

type RatingProps = StylelessRatingProps;

const Rating = React.forwardRef<HTMLDivElement, RatingProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessRating
      className={cn('inline-flex items-center gap-1', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Rating.displayName = 'Rating';

export { Rating };
export type { RatingProps };
