import { useControllableState, useId } from '@nebula/hooks';
import { Popper } from '@nebula/primitives/popper';
import { VisuallyHidden } from '@nebula/primitives/visually-hidden';
import * as React from 'react';

import { SelectProvider, usePopperScope } from './select-context';

import type { ScopedProps } from './select-context';

interface SelectProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Controlled: the currently selected item's value. */
  value?: string;
  /** Uncontrolled: the initially selected item's value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  /** Mirrored onto a visually-hidden native `<select>` so this participates in native `<form>` submission. */
  name?: string;
  children?: React.ReactNode;
}

/**
 * Root of the Select compound component — the WAI-ARIA
 * [collapsible listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-collapsible/):
 * a button (`SelectTrigger`, `aria-haspopup="listbox"`) that opens an
 * anchor-positioned `role="listbox"` popup (`SelectContent`), built on
 * `@nebula/primitives`' `Popper` exactly like `Popover`. `SelectContent`
 * reuses `Listbox`'s single-select roving-tabindex/typeahead behavior
 * directly instead of reimplementing it a third time — see `SelectContent`'s
 * doc comment for how the two compose into one DOM node.
 *
 * A visually-hidden native `<select>` mirrors the current value (same
 * hidden-native-input technique `Checkbox`/`Switch`/`RadioGroup` use) so this
 * participates in native `<form>` submission — only rendered when `name` is
 * given, since without one there's nothing for a `<form>` to submit under.
 *
 * @example
 * ```tsx
 * <Select defaultValue="apple" name="fruit">
 *   <SelectTrigger>
 *     <SelectValue placeholder="Pick a fruit" />
 *   </SelectTrigger>
 *   <SelectPortal>
 *     <SelectContent>
 *       <SelectItem value="apple">Apple</SelectItem>
 *       <SelectItem value="banana">Banana</SelectItem>
 *     </SelectContent>
 *   </SelectPortal>
 * </Select>
 * ```
 */
function Select(props: ScopedProps<SelectProps>) {
  const {
    __scopeSelect,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    required = false,
    name,
    children,
  } = props;
  const popperScope = usePopperScope(__scopeSelect);

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    // `useControllableState`'s `onChange` fires with every new state value,
    // including `undefined` (nothing selected) — but the public
    // `onValueChange` prop only ever represents a real selection, so
    // `undefined` is filtered out here rather than widening the public
    // prop's type to match internal state shape.
    onChange: (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
  });

  const contentId = useId('nebula-select-content');
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

  return (
    <Popper {...popperScope}>
      <SelectProvider
        scope={__scopeSelect}
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setOpen(false);
        }}
        disabled={disabled}
        required={required}
        name={name}
        contentId={contentId}
        registerItemLabel={registerItemLabel}
        unregisterItemLabel={unregisterItemLabel}
        getItemLabel={getItemLabel}
      >
        {children}
        {name ? (
          <VisuallyHidden as="span">
            {/* Read-only from React's point of view — `value` is driven by
                `Select`'s own state, never by interacting with this element
                directly (it's `aria-hidden`/`tabIndex={-1}`). The no-op
                `onChange` only exists to satisfy React's controlled-input
                console warning. */}
            <select
              tabIndex={-1}
              aria-hidden="true"
              name={name}
              required={required}
              disabled={disabled}
              value={value ?? ''}
              onChange={() => {}}
            >
              <option value="" />
              {Array.from(labelMap.entries()).map(([itemValue, label]) => (
                <option key={itemValue} value={itemValue}>
                  {label}
                </option>
              ))}
            </select>
          </VisuallyHidden>
        ) : null}
      </SelectProvider>
    </Popper>
  );
}

export { Select };
export type { SelectProps };
