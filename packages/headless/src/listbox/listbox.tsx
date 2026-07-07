import { useControllableState } from '@nebula/hooks';
import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula/primitives/compose-refs';
import { Primitive } from '@nebula/primitives/primitive';
import { RovingFocusGroup } from '@nebula/primitives/roving-focus-group';
import * as React from 'react';

import { ListboxProvider } from './listbox-context';

import type { ScopedProps } from './listbox-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';
import type { RovingFocusGroupOrientation } from '@nebula/primitives/roving-focus-group';

interface ListboxSharedProps extends PrimitivePropsWithRef<'div'> {
  disabled?: boolean;
  /** @default 'vertical' */
  orientation?: RovingFocusGroupOrientation;
  /** Arrow keys wrap from the last option back to the first. @default true */
  loop?: boolean;
}

interface ListboxSingleProps extends ListboxSharedProps {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
}

interface ListboxMultipleProps extends ListboxSharedProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

/**
 * Discriminated on `type`, same split `Accordion`/`ToggleGroup` use:
 * `"single"` behaves like a native `<select>` (arrow-key focus movement also
 * selects — "selection follows focus"), `"multiple"` requires an explicit
 * click/Enter/Space to toggle each option (focus movement alone never
 * selects, matching `ToggleGroup`).
 */
type ListboxProps = ListboxSingleProps | ListboxMultipleProps;

const LISTBOX_NAME = 'Listbox';

/**
 * Root of the Listbox compound component — `role="listbox"` over a set of
 * {@link ListboxOption}s, the WAI-ARIA
 * [Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).
 * Delegates to one of two internal implementations based on `type`, same
 * reasoning as `Accordion`'s `AccordionImplSingle`/`AccordionImplMultiple`
 * split.
 *
 * Typeahead: typing a printable character while any option has focus jumps
 * focus to the next option whose text starts with the accumulated buffer
 * (case-insensitive), resetting after a short pause — implemented by
 * querying `[role="option"]` elements directly under the root rather than a
 * separate option-registration system, a deliberate simplification (options
 * are always simple, static text here; a registration system would only
 * matter for options whose accessible name can't be read synchronously from
 * `textContent`, which none of this package's consumers need).
 *
 * @example
 * ```tsx
 * <Listbox type="single" defaultValue="apple" aria-label="Fruit">
 *   <ListboxOption value="apple">Apple</ListboxOption>
 *   <ListboxOption value="banana">Banana</ListboxOption>
 * </Listbox>
 * ```
 */
const Listbox = React.forwardRef<HTMLDivElement, ScopedProps<ListboxProps>>(
  (props, forwardedRef) => {
    if (props.type === 'multiple') {
      return <ListboxImplMultiple {...props} ref={forwardedRef} />;
    }
    return <ListboxImplSingle {...props} ref={forwardedRef} />;
  },
);

Listbox.displayName = LISTBOX_NAME;

const ListboxImplSingle = React.forwardRef<HTMLDivElement, ScopedProps<ListboxSingleProps>>(
  (props, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, type: _type, ...implProps } = props;

    const [value, setValue] = useControllableState<string | undefined>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    return (
      <ListboxImpl
        {...implProps}
        ref={forwardedRef}
        selectOnFocus
        isItemSelected={(itemValue) => itemValue === value}
        onItemSelectedChange={(itemValue, selected) => {
          if (selected) setValue(itemValue);
        }}
      />
    );
  },
);

ListboxImplSingle.displayName = 'ListboxImplSingle';

const ListboxImplMultiple = React.forwardRef<HTMLDivElement, ScopedProps<ListboxMultipleProps>>(
  (props, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, type: _type, ...implProps } = props;

    const [value, setValue] = useControllableState<string[]>({
      prop: valueProp,
      defaultProp: defaultValue ?? [],
      onChange: onValueChange,
    });

    return (
      <ListboxImpl
        {...implProps}
        ref={forwardedRef}
        selectOnFocus={false}
        isItemSelected={(itemValue) => (value ?? []).includes(itemValue)}
        onItemSelectedChange={(itemValue, selected) => {
          setValue((current) => {
            const currentValues = current ?? [];
            return selected
              ? [...currentValues, itemValue]
              : currentValues.filter((v) => v !== itemValue);
          });
        }}
      />
    );
  },
);

ListboxImplMultiple.displayName = 'ListboxImplMultiple';

interface ListboxImplProps extends PrimitivePropsWithRef<'div'> {
  disabled?: boolean;
  orientation?: RovingFocusGroupOrientation;
  loop?: boolean;
  selectOnFocus: boolean;
  isItemSelected: (value: string) => boolean;
  onItemSelectedChange: (value: string, selected: boolean) => void;
}

const TYPEAHEAD_RESET_MS = 500;

const ListboxImpl = React.forwardRef<HTMLDivElement, ScopedProps<ListboxImplProps>>(
  (props, forwardedRef) => {
    const {
      __scopeListbox,
      disabled = false,
      orientation = 'vertical',
      loop = true,
      selectOnFocus,
      isItemSelected,
      onItemSelectedChange,
      onKeyDown,
      ...groupProps
    } = props;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, rootRef);
    const typeaheadBuffer = React.useRef('');
    const typeaheadTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const handleTypeahead = (event: React.KeyboardEvent) => {
      if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) return;
      const root = rootRef.current;
      if (!root) return;

      window.clearTimeout(typeaheadTimer.current);
      typeaheadBuffer.current += event.key.toLowerCase();
      const buffer = typeaheadBuffer.current;
      typeaheadTimer.current = setTimeout(() => {
        typeaheadBuffer.current = '';
      }, TYPEAHEAD_RESET_MS);

      const options = Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'));
      const match = options.find((option) => option.textContent?.toLowerCase().trim().startsWith(buffer));
      match?.focus();
    };

    return (
      <ListboxProvider
        scope={__scopeListbox}
        isItemSelected={isItemSelected}
        onItemSelectedChange={onItemSelectedChange}
        selectOnFocus={selectOnFocus}
        disabled={disabled}
        orientation={orientation}
      >
        <RovingFocusGroup asChild orientation={orientation} loop={loop}>
          <Primitive
            as="div"
            role="listbox"
            aria-multiselectable={!selectOnFocus || undefined}
            aria-orientation={orientation}
            data-disabled={disabled ? '' : undefined}
            {...groupProps}
            ref={composedRef}
            onKeyDown={composeEventHandlers(onKeyDown, handleTypeahead)}
          />
        </RovingFocusGroup>
      </ListboxProvider>
    );
  },
);

ListboxImpl.displayName = 'ListboxImpl';

export { Listbox };
export type { ListboxProps, ListboxSingleProps, ListboxMultipleProps };
