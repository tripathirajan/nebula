
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { FocusItem } from '@nebula-lab/primitives/roving-focus-group';
import * as React from 'react';


import { Toggle } from '../toggle/toggle';

import { useToggleGroupContext } from './toggle-group-context';

import type { ScopedProps } from './toggle-group-context';
import type { ToggleProps } from '../toggle/toggle';

const TOGGLE_GROUP_ITEM_NAME = 'ToggleGroupItem';

interface ToggleGroupItemProps extends Omit<ToggleProps, 'pressed' | 'defaultPressed' | 'onPressedChange'> {
  /** Identifies this item within its `ToggleGroup` — must be unique within the group. */
  value: string;
}

/**
 * A {@link Toggle} whose pressed state comes entirely from `ToggleGroup`'s
 * context (comparing this item's `value` against the group's pressed
 * value(s)) rather than local state — this component holds none itself,
 * same relationship `RadioGroupItem` has to `RadioGroup`. Wrapped in
 * `@nebula-lab/primitives`' `FocusItem` for roving-tabindex + arrow-key movement
 * between items (finds the ambient `RovingFocusGroup` `ToggleGroup` renders,
 * via ordinary React context — no manual scope wiring needed). Unlike
 * `RadioGroupItem`, arrow-key focus movement does *not* also press the item
 * — a toolbar of toggle buttons keeps native button semantics (only a real
 * click/Enter/Space activates), matching `AccordionTrigger`'s footnote on
 * the same distinction.
 *
 * @example
 * ```tsx
 * <ToggleGroupItem value="bold" aria-label="Bold">
 *   <BoldIcon />
 * </ToggleGroupItem>
 * ```
 */
const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ScopedProps<ToggleGroupItemProps>>(
  (props, forwardedRef) => {
    const { __scopeToggleGroup, value, disabled: disabledProp, onClick, ...itemProps } = props;
    const context = useToggleGroupContext(TOGGLE_GROUP_ITEM_NAME, __scopeToggleGroup);
    const disabled = disabledProp || context.disabled;
    const pressed = context.isItemPressed(value);

    return (
      <FocusItem asChild focusable={!disabled}>
        <Toggle
          pressed={pressed}
          disabled={disabled}
          data-orientation={context.orientation}
          {...itemProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(onClick, () => {
            context.onItemPressedChange(value, !pressed);
          })}
        />
      </FocusItem>
    );
  },
);

ToggleGroupItem.displayName = TOGGLE_GROUP_ITEM_NAME;

export { ToggleGroupItem };
export type { ToggleGroupItemProps };
