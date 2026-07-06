import { useControllableState, useId } from '@nebula/hooks';
import { Popper } from '@nebula/primitives/popper';
import * as React from 'react';

import { ComboboxProvider, usePopperScope } from './combobox-context';

import type { ScopedProps } from './combobox-context';

interface ComboboxProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Root of the Combobox compound component — the WAI-ARIA
 * [editable combobox with list autocomplete pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/):
 * a text `ComboboxInput` (`role="combobox"`, `aria-autocomplete="list"`)
 * whose typed text filters an anchor-positioned `role="listbox"` popup
 * (`ComboboxContent`). Deliberately NOT built on `Listbox`/`ListboxOption`
 * the way `Select` is — real DOM focus has to stay on the input the entire
 * time so typing keeps working while arrowing through options, so
 * "highlighted" option tracking here is virtual (`aria-activedescendant`),
 * never a real focus move the way `Listbox`'s roving-tabindex model uses.
 *
 * Filtering itself is left to the consumer: render only the `ComboboxItem`s
 * that match `inputValue` (however you want to match — substring, fuzzy,
 * server-side, ...) as `ComboboxContent`'s children. Arrow-key highlight
 * movement queries whatever's actually mounted, so it always reflects
 * exactly what the consumer chose to filter down to.
 *
 * @example
 * ```tsx
 * const [inputValue, setInputValue] = useState('');
 * const filtered = fruits.filter((f) => f.toLowerCase().includes(inputValue.toLowerCase()));
 *
 * <Combobox inputValue={inputValue} onInputValueChange={setInputValue}>
 *   <ComboboxInput aria-label="Fruit" />
 *   <ComboboxPortal>
 *     <ComboboxContent>
 *       {filtered.map((fruit) => (
 *         <ComboboxItem key={fruit} value={fruit}>{fruit}</ComboboxItem>
 *       ))}
 *     </ComboboxContent>
 *   </ComboboxPortal>
 * </Combobox>
 * ```
 */
function Combobox(props: ScopedProps<ComboboxProps>) {
  const {
    __scopeCombobox,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    inputValue: inputValueProp,
    defaultInputValue = '',
    onInputValueChange,
    disabled = false,
    children,
  } = props;
  const popperScope = usePopperScope(__scopeCombobox);

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
  });
  const [inputValue, setInputValue] = useControllableState<string>({
    prop: inputValueProp,
    defaultProp: defaultInputValue,
    onChange: onInputValueChange,
  });
  const [highlightedValue, setHighlightedValue] = React.useState<string | undefined>(undefined);

  const contentId = useId('nebula-combobox-content');
  const inputId = useId('nebula-combobox-input');
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [labelMap, setLabelMap] = React.useState<Map<string, string>>(() => new Map());
  const registerItemLabel = React.useCallback((itemValue: string, label: string) => {
    setLabelMap((current) => {
      if (current.get(itemValue) === label) return current;
      const next = new Map(current);
      next.set(itemValue, label);
      return next;
    });
  }, []);
  const unregisterItemLabel = React.useCallback((itemValue: string) => {
    setLabelMap((current) => {
      if (!current.has(itemValue)) return current;
      const next = new Map(current);
      next.delete(itemValue);
      return next;
    });
  }, []);
  const getItemLabel = React.useCallback(
    (itemValue: string) => labelMap.get(itemValue),
    [labelMap],
  );
  const getOptionId = React.useCallback((itemValue: string) => `${contentId}-option-${itemValue}`, [
    contentId,
  ]);

  return (
    <Popper {...popperScope}>
      <ComboboxProvider
        scope={__scopeCombobox}
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={(next, label) => {
          setValue(next);
          setInputValue(label);
          setOpen(false);
          setHighlightedValue(undefined);
        }}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        highlightedValue={highlightedValue}
        setHighlightedValue={setHighlightedValue}
        disabled={disabled}
        contentId={contentId}
        inputId={inputId}
        getOptionId={getOptionId}
        registerItemLabel={registerItemLabel}
        unregisterItemLabel={unregisterItemLabel}
        getItemLabel={getItemLabel}
        contentRef={contentRef}
      >
        {children}
      </ComboboxProvider>
    </Popper>
  );
}

export { Combobox };
export type { ComboboxProps };
