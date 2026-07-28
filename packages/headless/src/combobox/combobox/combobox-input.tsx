import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Input } from '@nebula-lab/primitives/input';
import { PopperAnchor } from '@nebula-lab/primitives/popper';
import * as React from 'react';

import { useComboboxContext, usePopperScope } from './combobox-context';

import type { ScopedProps } from './combobox-context';
import type { InputProps } from '@nebula-lab/primitives/input';

const COMBOBOX_INPUT_NAME = 'ComboboxInput';

type ComboboxInputProps = Omit<InputProps, 'value' | 'defaultValue' | 'role'>;

function getVisibleOptionValues(root: HTMLElement | null): string[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'))
    .filter((el) => el.getAttribute('aria-disabled') !== 'true')
    .map((el) => el.dataset.value)
    .filter((value): value is string => value !== undefined);
}

/**
 * `role="combobox"` on the real text input — per the WAI-ARIA combobox
 * pattern, this is where `aria-expanded`/`aria-controls`/`aria-activedescendant`
 * all live (not on some other trigger element). Typing updates
 * `inputValue` and opens the popup; Arrow Up/Down move
 * `highlightedValue` across whatever `ComboboxItem`s are currently mounted
 * (see `Combobox`'s doc comment on why this queries the DOM directly rather
 * than a tracked array) without moving real focus; Enter selects the
 * highlighted item; Escape closes.
 *
 * @example
 * ```tsx
 * <ComboboxInput aria-label="Fruit" placeholder="Search fruit…" />
 * ```
 */
const ComboboxInput = React.forwardRef<HTMLInputElement, ScopedProps<ComboboxInputProps>>(
  (props, forwardedRef) => {
    const { __scopeCombobox, id, onChange, onKeyDown, disabled: disabledProp, ...inputProps } =
      props;
    const context = useComboboxContext(COMBOBOX_INPUT_NAME, __scopeCombobox);
    const popperScope = usePopperScope(__scopeCombobox);
    const disabled = disabledProp || context.disabled;

    const moveHighlight = (direction: 1 | -1) => {
      const values = getVisibleOptionValues(context.contentRef.current);
      if (values.length === 0) return;
      const currentIndex = context.highlightedValue
        ? values.indexOf(context.highlightedValue)
        : -1;
      const nextIndex =
        currentIndex === -1
          ? direction === 1
            ? 0
            : values.length - 1
          : (currentIndex + direction + values.length) % values.length;
      context.setHighlightedValue(values[nextIndex]);
    };

    return (
      <PopperAnchor asChild {...popperScope}>
        <Input
          id={id ?? context.inputId}
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={context.open}
          aria-controls={context.contentId}
          aria-activedescendant={
            context.highlightedValue ? context.getOptionId(context.highlightedValue) : undefined
          }
          disabled={disabled}
          value={context.inputValue}
          {...inputProps}
          ref={forwardedRef}
          onChange={composeEventHandlers(onChange, (event) => {
            context.onInputValueChange(event.currentTarget.value);
            if (!context.open) context.onOpenChange(true);
          })}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (disabled) return;
            switch (event.key) {
              case 'ArrowDown':
                event.preventDefault();
                if (!context.open) context.onOpenChange(true);
                moveHighlight(1);
                break;
              case 'ArrowUp':
                event.preventDefault();
                if (!context.open) context.onOpenChange(true);
                moveHighlight(-1);
                break;
              case 'Enter':
                if (context.open && context.highlightedValue) {
                  event.preventDefault();
                  const label = context.getItemLabel(context.highlightedValue);
                  context.onValueChange(context.highlightedValue, label ?? '');
                }
                break;
              case 'Escape':
                if (context.open) {
                  event.preventDefault();
                  context.onOpenChange(false);
                  context.setHighlightedValue(undefined);
                }
                break;
              default:
                break;
            }
          })}
        />
      </PopperAnchor>
    );
  },
);

ComboboxInput.displayName = COMBOBOX_INPUT_NAME;

export { ComboboxInput };
export type { ComboboxInputProps };
