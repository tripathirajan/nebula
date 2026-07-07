import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import * as React from 'react';

import { Checkbox } from '../checkbox/checkbox';

import { useCheckboxGroupContext } from './checkbox-group-context';

import type { ScopedProps } from './checkbox-group-context';
import type { CheckboxProps } from '../checkbox/checkbox';

const CHECKBOX_GROUP_ITEM_NAME = 'CheckboxGroupItem';

interface CheckboxGroupItemProps
  extends Omit<CheckboxProps, 'checked' | 'defaultChecked' | 'onCheckedChange' | 'name'> {
  /** Identifies this item within its `CheckboxGroup` — must be unique within the group. */
  value: string;
}

/**
 * A {@link Checkbox} whose checked state comes entirely from
 * `CheckboxGroup`'s context (whether this item's `value` is in the group's
 * checked set) rather than local state — same relationship
 * `ToggleGroupItem` has to `Toggle`. `Checkbox`'s own tri-state
 * (`'indeterminate'`) is intentionally not exposed here — group membership
 * is a plain boolean.
 *
 * @example
 * ```tsx
 * <CheckboxGroupItem value="red">Red</CheckboxGroupItem>
 * ```
 */
const CheckboxGroupItem = React.forwardRef<HTMLButtonElement, ScopedProps<CheckboxGroupItemProps>>(
  (props, forwardedRef) => {
    const { __scopeCheckboxGroup, value, disabled: disabledProp, onClick, ...itemProps } = props;
    const context = useCheckboxGroupContext(CHECKBOX_GROUP_ITEM_NAME, __scopeCheckboxGroup);
    const disabled = disabledProp || context.disabled;
    const checked = context.isItemChecked(value);

    return (
      <Checkbox
        checked={checked}
        disabled={disabled}
        name={context.name}
        value={value}
        {...itemProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          context.onItemCheckedChange(value, !checked);
        })}
      />
    );
  },
);

CheckboxGroupItem.displayName = CHECKBOX_GROUP_ITEM_NAME;

export { CheckboxGroupItem };
export type { CheckboxGroupItemProps };
