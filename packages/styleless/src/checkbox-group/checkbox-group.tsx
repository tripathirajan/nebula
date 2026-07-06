import { useControllableState } from '@nebula/hooks';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { CheckboxGroupProvider } from './checkbox-group-context';

import type { ScopedProps } from './checkbox-group-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface CheckboxGroupProps extends PrimitivePropsWithRef<'div'> {
  /** Controlled: the set of currently checked items' values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  /** Forwarded to every item's hidden native checkbox input for `<form>` submission. */
  name?: string;
}

/**
 * `role="group"` over a set of {@link CheckboxGroupItem}s — unlike
 * `RadioGroup`/`ToggleGroup`, there's no roving-tabindex here: native
 * checkboxes in a group are each independently `Tab`-reachable (there's no
 * "arrow keys move between them" convention the way radio buttons have), so
 * this doesn't wrap `@nebula/primitives`' `RovingFocusGroup` at all —
 * `CheckboxGroupItem` is just a plain `Checkbox` reading its checked state
 * from context.
 *
 * @example
 * ```tsx
 * <CheckboxGroup defaultValue={['red']} aria-label="Favorite colors">
 *   <CheckboxGroupItem value="red">Red</CheckboxGroupItem>
 *   <CheckboxGroupItem value="blue">Blue</CheckboxGroupItem>
 * </CheckboxGroup>
 * ```
 */
const CheckboxGroup = React.forwardRef<HTMLDivElement, ScopedProps<CheckboxGroupProps>>(
  (props, forwardedRef) => {
    const {
      __scopeCheckboxGroup,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled = false,
      name,
      ...groupProps
    } = props;

    const [value, setValue] = useControllableState<string[]>({
      prop: valueProp,
      defaultProp: defaultValue ?? [],
      onChange: onValueChange,
    });

    return (
      <CheckboxGroupProvider
        scope={__scopeCheckboxGroup}
        isItemChecked={(itemValue) => (value ?? []).includes(itemValue)}
        onItemCheckedChange={(itemValue, checked) => {
          setValue((current) => {
            const currentValues = current ?? [];
            return checked
              ? [...currentValues, itemValue]
              : currentValues.filter((v) => v !== itemValue);
          });
        }}
        disabled={disabled}
        name={name}
      >
        <Primitive
          as="div"
          role="group"
          data-disabled={disabled ? '' : undefined}
          {...groupProps}
          ref={forwardedRef}
        />
      </CheckboxGroupProvider>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';

export { CheckboxGroup };
export type { CheckboxGroupProps };
