import { useControllableState } from '@nebula-lab/hooks';
import * as React from 'react';

import { Popover } from '../popover/popover';

import { MultiSelectContext } from './multi-select-context';

interface MultiSelectProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Controlled: the currently selected values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Root of the MultiSelect compound component — built directly in `react-ui`
 * with no `@nebula-lab/headless` layer underneath, the same project-owner call
 * `Carousel`/`DataTable`/`DataGrid` make: this composes two already-built
 * pieces (this package's own `Popover` for anchor positioning, and
 * `@nebula-lab/headless`'s `Listbox` `type="multiple"` for the actual
 * multi-selection behavior) rather than being a new independent ARIA
 * pattern needing its own unstyled primitive — see `MultiSelectContent`'s
 * doc comment for exactly how the two compose into one DOM node.
 *
 * Unlike this package's own `Select` (single-value, built on `@nebula-lab/headless/select`
 * directly), there is no multi-value `headless` `Select` variant to build
 * on, so `MultiSelect` instead mints its own ambient `Popover` — the same
 * "mint one ambient instance" reuse `ColorPicker`/`MenubarMenu` make of
 * `Popover`/`Menu` — and tracks label registration itself via a plain
 * `React.createContext` (see `multi-select-context.tsx`) rather than
 * `@nebula-lab/primitives`' scoped context, since nothing else needs to compose
 * into this scope.
 *
 * @example
 * ```tsx
 * <MultiSelect defaultValue={['apple']}>
 *   <MultiSelectTrigger placeholder="Pick fruits" />
 *   <MultiSelectPortal>
 *     <MultiSelectContent>
 *       <MultiSelectItem value="apple">Apple</MultiSelectItem>
 *       <MultiSelectItem value="banana">Banana</MultiSelectItem>
 *     </MultiSelectContent>
 *   </MultiSelectPortal>
 * </MultiSelect>
 * ```
 */
function MultiSelect(props: MultiSelectProps) {
  const {
    open,
    defaultOpen = false,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    children,
  } = props;

  const [value, setValue] = useControllableState<string[]>({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
  });

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

  const contextValue = React.useMemo(
    () => ({
      value: value ?? [],
      setValue: (next: string[]) => setValue(next),
      disabled,
      registerItemLabel,
      unregisterItemLabel,
      getItemLabel,
    }),
    [value, setValue, disabled, registerItemLabel, unregisterItemLabel, getItemLabel],
  );

  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <MultiSelectContext.Provider value={contextValue}>{children}</MultiSelectContext.Provider>
    </Popover>
  );
}

export { MultiSelect };
export type { MultiSelectProps };
