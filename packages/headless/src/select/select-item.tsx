import * as React from 'react';

import { ListboxOption } from '../listbox/listbox-option';

import { useSelectContext } from './select-context';

import type { ScopedProps } from './select-context';
import type { ListboxOptionProps } from '../listbox/listbox-option';

const SELECT_ITEM_NAME = 'SelectItem';

interface SelectItemProps extends Omit<ListboxOptionProps, 'value'> {
  value: string;
  /**
   * Overrides the label `SelectValue` displays and registers for this item —
   * only needed when `children` isn't plain text (e.g. an icon + label),
   * since otherwise `children` itself is used automatically. Same rationale
   * as `AccordionTrigger`'s doc note on why `Radio`-style codebases add a
   * `textValue` escape hatch here.
   */
  textValue?: string;
}

/**
 * A thin wrapper over `Listbox`'s `ListboxOption` (`role="option"`, roving
 * tabindex, click/Enter/Space to select — all unchanged) that adds one real
 * behavior on top: registering this item's display label against `Select`'s
 * own context so `SelectValue` can look it up, and unregistering it on
 * unmount.
 *
 * @example
 * ```tsx
 * <SelectItem value="banana">Banana</SelectItem>
 * <SelectItem value="cherry" textValue="Cherry">🍒 Cherry</SelectItem>
 * ```
 */
const SelectItem = React.forwardRef<HTMLDivElement, ScopedProps<SelectItemProps>>(
  (props, forwardedRef) => {
    const { __scopeSelect, value, textValue, children, ...itemProps } = props;
    const context = useSelectContext(SELECT_ITEM_NAME, __scopeSelect);
    const { registerItemLabel, unregisterItemLabel } = context;

    React.useEffect(() => {
      const label = textValue ?? (typeof children === 'string' ? children : undefined);
      if (label !== undefined) registerItemLabel(value, label);
      return () => unregisterItemLabel(value);
      // Deliberately depends on `registerItemLabel`/`unregisterItemLabel`
      // directly, not the whole `context` object: `context.getItemLabel`
      // (unrelated to this effect) is itself recomputed every time
      // `Select`'s `labelMap` state changes — the *same* state this effect
      // writes to — so depending on `context` as a whole created a circular
      // loop: register → `labelMap` changes → `context` changes → effect
      // re-runs → unregister+register → `labelMap` changes → ... forever.
    }, [registerItemLabel, unregisterItemLabel, value, textValue, children]);

    return (
      <ListboxOption value={value} {...itemProps} ref={forwardedRef}>
        {children}
      </ListboxOption>
    );
  },
);

SelectItem.displayName = SELECT_ITEM_NAME;

export { SelectItem };
export type { SelectItemProps };
