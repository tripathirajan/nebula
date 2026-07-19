import { useControllableState } from '@nebula-lab/hooks';
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { RovingFocusGroup } from '@nebula-lab/primitives/roving-focus-group';
import * as React from 'react';

import { RatingProvider } from './rating-context';

import type { ScopedProps } from './rating-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface RatingProps extends PrimitivePropsWithRef<'div'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  required?: boolean;
  /** Forwarded to every item's hidden native radio input for `<form>` submission. */
  name?: string;
}

/**
 * `role="radiogroup"` over a set of {@link RatingItem}s (typically stars) —
 * single-select, close to `RadioGroup`'s own shape, plus pointer-hover
 * preview: moving the pointer over an item visually fills every item up to
 * it (via each item's own `data-state`, computed from `hoveredValue` when
 * present), without committing the selection until a real click/Enter/Space.
 * Leaving the whole group resets the preview back to the committed `value`.
 *
 * @example
 * ```tsx
 * <Rating defaultValue={3} aria-label="Rate this product">
 *   <RatingItem value={1} aria-label="1 star" />
 *   <RatingItem value={2} aria-label="2 stars" />
 *   <RatingItem value={3} aria-label="3 stars" />
 *   <RatingItem value={4} aria-label="4 stars" />
 *   <RatingItem value={5} aria-label="5 stars" />
 * </Rating>
 * ```
 */
const Rating = React.forwardRef<HTMLDivElement, ScopedProps<RatingProps>>(
  (props, forwardedRef) => {
    const {
      __scopeRating,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      name,
      onPointerLeave,
      ...groupProps
    } = props;

    const [value, setValue] = useControllableState<number | undefined>({
      prop: valueProp,
      defaultProp: defaultValue,
      // Same reasoning as `Select`'s root: `useControllableState`'s
      // `onChange` fires with every new state value including `undefined`
      // (nothing rated yet), but the public `onValueChange` prop only ever
      // represents a real rating.
      onChange: (next) => {
        if (next !== undefined) onValueChange?.(next);
      },
    });
    const [hoveredValue, setHoveredValue] = React.useState<number | undefined>(undefined);

    return (
      <RatingProvider
        scope={__scopeRating}
        value={value}
        onValueChange={setValue}
        hoveredValue={hoveredValue}
        setHoveredValue={setHoveredValue}
        disabled={disabled}
        required={required}
        name={name}
      >
        <RovingFocusGroup asChild orientation="horizontal" loop>
          <Primitive
            as="div"
            role="radiogroup"
            aria-required={required || undefined}
            data-disabled={disabled ? '' : undefined}
            {...groupProps}
            ref={forwardedRef}
            onPointerLeave={composeEventHandlers(onPointerLeave, () => setHoveredValue(undefined))}
          />
        </RovingFocusGroup>
      </RatingProvider>
    );
  },
);

Rating.displayName = 'Rating';

export { Rating };
export type { RatingProps };
