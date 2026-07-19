import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { FocusItem } from '@nebula-lab/primitives/roving-focus-group';
import * as React from 'react';

import { useListboxContext } from './listbox-context';

import type { ScopedProps } from './listbox-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const LISTBOX_OPTION_NAME = 'ListboxOption';

interface ListboxOptionProps extends PrimitivePropsWithRef<'div'> {
  /** Identifies this option within its `Listbox` — must be unique within the list. */
  value: string;
  disabled?: boolean;
}

/**
 * `role="option"`. Selected state comes entirely from `Listbox`'s context
 * (comparing this option's `value` against the list's selected value(s)) —
 * this component holds no local state. Wrapped in `@nebula-lab/primitives`'
 * `FocusItem` for roving-tabindex + arrow-key movement.
 *
 * @example
 * ```tsx
 * <ListboxOption value="banana">Banana</ListboxOption>
 * ```
 */
const ListboxOption = React.forwardRef<HTMLDivElement, ScopedProps<ListboxOptionProps>>(
  (props, forwardedRef) => {
    const { __scopeListbox, value, disabled: disabledProp, onClick, onFocus, onKeyDown, ...optionProps } = props;
    const context = useListboxContext(LISTBOX_OPTION_NAME, __scopeListbox);
    const disabled = disabledProp || context.disabled;
    const selected = context.isItemSelected(value);

    const select = () => {
      if (disabled) return;
      context.onItemSelectedChange(value, !context.selectOnFocus ? !selected : true);
    };

    return (
      <FocusItem asChild focusable={!disabled}>
        <Primitive
          as="div"
          role="option"
          aria-selected={selected}
          aria-disabled={disabled || undefined}
          data-state={selected ? 'selected' : 'unselected'}
          data-disabled={disabled ? '' : undefined}
          tabIndex={-1}
          {...optionProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(onClick, select)}
          onFocus={composeEventHandlers(onFocus, () => {
            // Native <select>/RadioGroup select on arrow-key focus in
            // single-select mode; multi-select never selects on focus alone
            // (`context.selectOnFocus` is `false`), matching `ToggleGroup`.
            // `consumeInitialFocusSuppression()` guards against the one
            // focus event that isn't a real navigation: `FocusScope`
            // programmatically focusing the first option when this
            // `Listbox` mounts inside a freshly-opened popover.
            if (context.selectOnFocus && !context.consumeInitialFocusSuppression()) select();
          })}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (!context.selectOnFocus && (event.key === ' ' || event.key === 'Enter')) {
              event.preventDefault();
              select();
            }
          })}
        />
      </FocusItem>
    );
  },
);

ListboxOption.displayName = LISTBOX_OPTION_NAME;

export { ListboxOption };
export type { ListboxOptionProps };
