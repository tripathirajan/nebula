import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Input } from '@nebula-lab/primitives/input';
import * as React from 'react';

import { useCommandContext } from './command-context';

import type { ScopedProps } from './command-context';
import type { InputProps } from '@nebula-lab/primitives/input';

const COMMAND_INPUT_NAME = 'CommandInput';

type CommandInputProps = Omit<InputProps, 'value' | 'defaultValue' | 'role'>;

function getVisibleOptionValues(root: HTMLElement | null): string[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'))
    .filter((el) => el.getAttribute('aria-disabled') !== 'true')
    .map((el) => el.dataset.value)
    .filter((value): value is string => value !== undefined);
}

/**
 * `role="combobox"`, always `aria-expanded="true"` — `CommandList` is never
 * hidden the way `ComboboxContent` is, so unlike `ComboboxInput` there's no
 * open/close state to manage here at all. Typing updates `inputValue`;
 * Arrow Up/Down move `highlightedValue` across whatever `CommandItem`s are
 * currently mounted (queried directly off the DOM, same technique
 * `ComboboxInput` uses); Enter runs the highlighted item's own `onSelect`.
 *
 * @example
 * ```tsx
 * <CommandInput aria-label="Command" placeholder="Type a command…" />
 * ```
 */
const CommandInput = React.forwardRef<HTMLInputElement, ScopedProps<CommandInputProps>>(
  (props, forwardedRef) => {
    const { __scopeCommand, id, onChange, onKeyDown, disabled: disabledProp, ...inputProps } =
      props;
    const context = useCommandContext(COMMAND_INPUT_NAME, __scopeCommand);
    const disabled = disabledProp || context.disabled;

    const moveHighlight = (direction: 1 | -1) => {
      const values = getVisibleOptionValues(context.listRef.current);
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
      <Input
        id={id ?? context.inputId}
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded="true"
        aria-controls={context.listId}
        aria-activedescendant={
          context.highlightedValue ? context.getOptionId(context.highlightedValue) : undefined
        }
        disabled={disabled}
        value={context.inputValue}
        {...inputProps}
        ref={forwardedRef}
        onChange={composeEventHandlers(onChange, (event) => {
          context.onInputValueChange(event.currentTarget.value);
        })}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          if (disabled) return;
          switch (event.key) {
            case 'ArrowDown':
              event.preventDefault();
              moveHighlight(1);
              break;
            case 'ArrowUp':
              event.preventDefault();
              moveHighlight(-1);
              break;
            case 'Enter':
              if (context.highlightedValue) {
                event.preventDefault();
                context.selectItem(context.highlightedValue);
              }
              break;
            default:
              break;
          }
        })}
      />
    );
  },
);

CommandInput.displayName = COMMAND_INPUT_NAME;

export { CommandInput };
export type { CommandInputProps };
