import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface StaticRatingOwnProps {
  /** 0-5, need not be a whole number (e.g. `4.5`) — rounds to the nearest whole star for the filled count. */
  value: number;
}

type StaticRatingProps = PrimitivePropsWithRef<'span'> & StaticRatingOwnProps;

function StarIcon(props: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={props.filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      className={cn('h-4 w-4', props.filled ? 'text-[var(--color-warning)]' : 'text-[var(--color-base-300)]')}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 2.5 2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.8-6.2 3.8 1.6-7-5.4-4.8 7.1-.7z"
      />
    </svg>
  );
}

/**
 * A read-only star rating display — `n`/5 filled stars plus an
 * `aria-label` announcing the score as a sentence. Deliberately **not**
 * `Rating` (a `role="radiogroup"` *input* for collecting a score, built on
 * `@nebula-lab/headless`'s `Rating`/`RatingItem`): reusing an input control to
 * merely display an average would announce a static number as an editable
 * control to assistive tech, which is wrong. This is `role="img"` instead
 * — one static node, not five separately-focusable ones — since there's no
 * interaction to expose, only a value to describe. Originally duplicated
 * ad hoc inside two separate `react-ui-blocks` blocks (`ReviewsList`'s and
 * `ProductInfoPanel`'s own local `StaticRating`, which had already started
 * to drift — different star size/empty-star treatment); promoted here
 * since a domain-neutral "show this numeric rating as stars" pattern
 * belongs in `react-ui`, not copy-pasted per block.
 *
 * Filled stars read `--color-warning` (the conventional gold/amber rating
 * color) rather than `Rating`'s own `--rating-filled` token
 * (`--color-primary`) — a deliberate divergence, not an inconsistency:
 * `Rating` is an *input*, where a brand-colored fill matches every other
 * form control's "selected" treatment across this package (`Checkbox`/
 * `Switch`/`RadioGroup` all fill with `--color-primary` too); this is a
 * *display*, where readers expect the familiar gold-star convention search
 * results, reviews, and marketplaces already train them on. Preserved
 * unchanged from the more complete of the two original ad hoc copies
 * (`ProductInfoPanel`'s, which unlike `ReviewsList`'s also explicitly
 * styles empty stars in `--color-base-300` rather than leaving them
 * unstyled) — this is a pure reusability refactor, not a restyle.
 *
 * @example
 * ```tsx
 * <StaticRating value={4.5} />
 * ```
 */
const StaticRating = React.forwardRef<HTMLSpanElement, StaticRatingProps>((props, forwardedRef) => {
  const { value, className, ...rest } = props;
  const rounded = Math.round(value);
  return (
    <Primitive
      as="span"
      role="img"
      aria-label={`${value} out of 5 stars`}
      className={cn('flex gap-0.5', className)}
      {...rest}
      ref={forwardedRef}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} filled={index < rounded} />
      ))}
    </Primitive>
  );
});

StaticRating.displayName = 'StaticRating';

export { StaticRating };
export type { StaticRatingProps };
