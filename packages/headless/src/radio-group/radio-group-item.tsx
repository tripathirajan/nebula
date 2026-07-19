
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula-lab/primitives/compose-refs';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { FocusItem } from '@nebula-lab/primitives/roving-focus-group';
import { VisuallyHidden } from '@nebula-lab/primitives/visually-hidden';
import * as React from 'react';

import { useRadioGroupContext } from './radio-group-context';

import type { ScopedProps } from './radio-group-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const RADIO_GROUP_ITEM_NAME = 'RadioGroupItem';

interface RadioGroupItemProps extends PrimitivePropsWithRef<'button'> {
  /** Identifies this item within its `RadioGroup` — must be unique within the group. */
  value: string;
  disabled?: boolean;
}

/**
 * `role="radio"`. Selected state comes entirely from `RadioGroup`'s context
 * (comparing this item's `value` against the group's selected value) — this
 * component holds no local selection state. Wrapped in `@nebula-lab/primitives`'
 * `FocusItem` for the roving-tabindex + arrow-key behavior (it finds the
 * ambient `RovingFocusGroup` that `RadioGroup` renders automatically, via
 * ordinary React context — no manual scope wiring needed here), so
 * selecting via click and selecting via arrow-key both call the same
 * `select()`.
 *
 * @example
 * ```tsx
 * <RadioGroupItem value="compact" disabled={!supportsCompact}>
 *   Compact
 * </RadioGroupItem>
 * ```
 */
const RadioGroupItem = React.forwardRef<HTMLButtonElement, ScopedProps<RadioGroupItemProps>>(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, value, disabled: disabledProp, onClick, onFocus, ...itemProps } = props;
    const context = useRadioGroupContext(RADIO_GROUP_ITEM_NAME, __scopeRadioGroup);
    const disabled = disabledProp || context.disabled;
    const isChecked = context.value === value;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const composedRef = useComposedRefs(forwardedRef, buttonRef);

    React.useEffect(() => {
      const input = inputRef.current;
      if (input) input.checked = isChecked;
    }, [isChecked]);

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
            aria-checked={isChecked}
            data-state={isChecked ? 'checked' : 'unchecked'}
            data-disabled={disabled ? '' : undefined}
            disabled={disabled}
            {...itemProps}
            ref={composedRef}
            onClick={composeEventHandlers(onClick, select)}
            onFocus={composeEventHandlers(onFocus, () => {
              // Native radio groups select on arrow-key focus, not just
              // click — FocusItem already moved DOM focus here, so
              // selecting on focus covers both input modes.
              select();
            })}
          />
        </FocusItem>
        <VisuallyHidden as="span">
          <input
            type="radio"
            ref={inputRef}
            defaultChecked={isChecked}
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

RadioGroupItem.displayName = RADIO_GROUP_ITEM_NAME;

export { RadioGroupItem };
export type { RadioGroupItemProps };
