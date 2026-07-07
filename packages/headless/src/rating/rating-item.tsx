import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula/primitives/compose-refs';
import { Primitive } from '@nebula/primitives/primitive';
import { FocusItem } from '@nebula/primitives/roving-focus-group';
import { VisuallyHidden } from '@nebula/primitives/visually-hidden';
import * as React from 'react';

import { useRatingContext } from './rating-context';

import type { ScopedProps } from './rating-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const RATING_ITEM_NAME = 'RatingItem';

interface RatingItemProps extends PrimitivePropsWithRef<'button'> {
  /** This item's numeric rating value, e.g. `3` for the third star. */
  value: number;
  disabled?: boolean;
}

/**
 * `role="radio"`. `data-state="filled"|"empty"` reflects whichever is
 * "active" right now — `hoveredValue` while the pointer is over the group,
 * falling back to the committed `value` otherwise — so `react-ui` can style
 * a filled vs. outline star purely off that attribute. Selecting via click
 * or arrow-key focus both commit the value immediately, same as
 * `RadioGroupItem`.
 *
 * @example
 * ```tsx
 * <RatingItem value={3} aria-label="3 stars">
 *   <StarIcon />
 * </RatingItem>
 * ```
 */
const RatingItem = React.forwardRef<HTMLButtonElement, ScopedProps<RatingItemProps>>(
  (props, forwardedRef) => {
    const {
      __scopeRating,
      value,
      disabled: disabledProp,
      onClick,
      onFocus,
      onPointerEnter,
      ...itemProps
    } = props;
    const context = useRatingContext(RATING_ITEM_NAME, __scopeRating);
    const disabled = disabledProp || context.disabled;
    const active = context.hoveredValue ?? context.value ?? 0;
    const filled = value <= active;
    const checked = context.value === value;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const composedRef = useComposedRefs(forwardedRef, buttonRef);

    React.useEffect(() => {
      const input = inputRef.current;
      if (input) input.checked = checked;
    }, [checked]);

    const select = () => {
      if (disabled) return;
      context.onValueChange(value);
      inputRef.current?.click();
    };

    return (
      <>
        <FocusItem asChild focusable={!disabled}>
          <Primitive
            as="button"
            type="button"
            role="radio"
            aria-checked={checked}
            data-state={filled ? 'filled' : 'empty'}
            data-disabled={disabled ? '' : undefined}
            disabled={disabled}
            {...itemProps}
            ref={composedRef}
            onClick={composeEventHandlers(onClick, select)}
            onFocus={composeEventHandlers(onFocus, select)}
            onPointerEnter={composeEventHandlers(onPointerEnter, () => {
              if (!disabled) context.setHoveredValue(value);
            })}
          />
        </FocusItem>
        <VisuallyHidden as="span">
          <input
            type="radio"
            ref={inputRef}
            defaultChecked={checked}
            aria-hidden="true"
            tabIndex={-1}
            name={context.name}
            value={value}
            disabled={disabled}
            required={context.required}
          />
        </VisuallyHidden>
      </>
    );
  },
);

RatingItem.displayName = RATING_ITEM_NAME;

export { RatingItem };
export type { RatingItemProps };
