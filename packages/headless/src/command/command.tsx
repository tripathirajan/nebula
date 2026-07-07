import { useControllableState, useId } from '@nebula/hooks';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { CommandProvider } from './command-context';

import type { ScopedProps } from './command-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface CommandProps extends PrimitivePropsWithRef<'div'> {
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  disabled?: boolean;
}

/**
 * Root of the Command compound component — the WAI-ARIA
 * [combobox-with-list pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/),
 * but always "open": unlike `Combobox`, there's no popup to show/hide —
 * `CommandInput` and `CommandList` are always both visible, which is the
 * whole "command palette" shape (usually rendered inside a `Dialog` the
 * consumer supplies, e.g. a ⌘K launcher). Real DOM focus stays on
 * `CommandInput` the entire time, same as `Combobox`; `highlightedValue` is
 * tracked virtually via `aria-activedescendant`.
 *
 * Filtering is left to the consumer, same convention `Combobox` uses:
 * render only the `CommandItem`s that match `inputValue` as `CommandList`'s
 * children (grouped under `CommandGroup`s if wanted). Selecting an item
 * calls *that item's own* `onSelect` — Command's items are actions
 * ("Create new file", "Go to settings"), not values that fill the input the
 * way a `Combobox` selection does.
 *
 * @example
 * ```tsx
 * const [inputValue, setInputValue] = useState('');
 * const filtered = commands.filter((c) => c.label.toLowerCase().includes(inputValue.toLowerCase()));
 *
 * <Command inputValue={inputValue} onInputValueChange={setInputValue}>
 *   <CommandInput aria-label="Command" placeholder="Type a command…" />
 *   <CommandList>
 *     {filtered.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
 *     <CommandGroup heading="Actions">
 *       {filtered.map((c) => (
 *         <CommandItem key={c.id} value={c.id} onSelect={c.run}>{c.label}</CommandItem>
 *       ))}
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 * ```
 */
const Command = React.forwardRef<HTMLDivElement, ScopedProps<CommandProps>>(
  (props, forwardedRef) => {
    const {
      __scopeCommand,
      inputValue: inputValueProp,
      defaultInputValue = '',
      onInputValueChange,
      disabled = false,
      ...rootProps
    } = props;

    const [inputValue, setInputValue] = useControllableState<string>({
      prop: inputValueProp,
      defaultProp: defaultInputValue,
      onChange: onInputValueChange,
    });
    const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>(undefined);

    const listId = useId('nebula-command-list');
    const inputId = useId('nebula-command-input');
    const listRef = React.useRef<HTMLDivElement>(null);

    const selectHandlersRef = React.useRef<Map<string, () => void>>(new Map());
    const registerItemSelect = React.useCallback((value: string, onSelect: () => void) => {
      selectHandlersRef.current.set(value, onSelect);
    }, []);
    const unregisterItemSelect = React.useCallback((value: string) => {
      selectHandlersRef.current.delete(value);
    }, []);
    const selectItem = React.useCallback((value: string) => {
      selectHandlersRef.current.get(value)?.();
    }, []);

    const getOptionId = React.useCallback((value: string) => `${listId}-option-${value}`, [listId]);

    return (
      <CommandProvider
        scope={__scopeCommand}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        highlightedValue={highlightedValue}
        setHighlightedValue={setHighlightedValue}
        disabled={disabled}
        listId={listId}
        inputId={inputId}
        getOptionId={getOptionId}
        listRef={listRef}
        registerItemSelect={registerItemSelect}
        unregisterItemSelect={unregisterItemSelect}
        selectItem={selectItem}
      >
        <Primitive as="div" {...rootProps} ref={forwardedRef} />
      </CommandProvider>
    );
  },
);

Command.displayName = 'Command';

export { Command };
export type { CommandProps };
