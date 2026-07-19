import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useComboboxContext } from './combobox-context';

import type { ScopedProps } from './combobox-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const COMBOBOX_ITEM_NAME = 'ComboboxItem';

interface ComboboxItemProps extends PrimitivePropsWithRef<'div'> {
  value: string;
  disabled?: boolean;
  /** Overrides the label used for `ComboboxInput`'s display text on selection — only needed when `children` isn't plain text. */
  textValue?: string;
}

/**
 * `role="option"` — highlighted state (`aria-selected`, `data-highlighted`)
 * comes from `Combobox`'s `highlightedValue`, not local state or real DOM
 * focus (real focus always stays on `ComboboxInput`; see that file's doc
 * comment). Hovering an item also highlights it, matching how a mouse user
 * expects a dropdown to behave alongside keyboard arrow navigation.
 *
 * @example
 * ```tsx
 * <ComboboxItem value="banana">Banana</ComboboxItem>
 * ```
 */
const ComboboxItem = React.forwardRef<HTMLDivElement, ScopedProps<ComboboxItemProps>>(
  (props, forwardedRef) => {
    const {
      __scopeCombobox,
      value,
      disabled = false,
      textValue,
      children,
      onClick,
      onPointerMove,
      ...itemProps
    } = props;
    const context = useComboboxContext(COMBOBOX_ITEM_NAME, __scopeCombobox);
    const highlighted = context.highlightedValue === value;
    const selected = context.value === value;
    const { registerItemLabel, unregisterItemLabel } = context;

    React.useEffect(() => {
      const label = textValue ?? (typeof children === 'string' ? children : undefined);
      if (label !== undefined) registerItemLabel(value, label);
      return () => unregisterItemLabel(value);
      // Deliberately depends on `registerItemLabel`/`unregisterItemLabel`
      // directly, not the whole `context` object: `context.getItemLabel`
      // (unrelated to this effect) is itself recomputed every time
      // `Combobox`'s `labelMap` state changes — the *same* state this
      // effect writes to — so depending on `context` as a whole would
      // create a circular loop: register → `labelMap` changes → `context`
      // changes → effect re-runs → unregister+register → `labelMap`
      // changes → ... forever.
    }, [registerItemLabel, unregisterItemLabel, value, textValue, children]);

    return (
      <Primitive
        as="div"
        id={context.getOptionId(value)}
        role="option"
        aria-selected={highlighted}
        aria-disabled={disabled || undefined}
        data-state={selected ? 'selected' : 'unselected'}
        data-highlighted={highlighted ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-value={value}
        {...itemProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          if (disabled) return;
          const label = textValue ?? (typeof children === 'string' ? children : '');
          context.onValueChange(value, label);
        })}
        onPointerMove={composeEventHandlers(onPointerMove, () => {
          if (!disabled) context.setHighlightedValue(value);
        })}
      >
        {children}
      </Primitive>
    );
  },
);

ComboboxItem.displayName = COMBOBOX_ITEM_NAME;

export { ComboboxItem };
export type { ComboboxItemProps };
