import { ListboxOption } from '@nebula-lab/headless/listbox';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import { useMultiSelectContext } from './multi-select-context';

import type { ListboxOptionProps } from '@nebula-lab/headless/listbox';

interface MultiSelectItemProps extends ListboxOptionProps {
  /** The accessible/displayed label registered with `MultiSelect` for `MultiSelectTrigger`'s summary — defaults to `children` when `children` is a plain string, same fallback `SelectItem`'s `textValue` convention documents. */
  textValue?: string;
}

/**
 * A built-in checkbox square (not a bare checkmark, unlike this package's
 * own `SelectItem`) is the deliberate visual distinction — a multi-select
 * option is *toggled*, not simply "the one current choice", so it reads more
 * like `CheckboxGroupItem` than `SelectItem`; reuses `checkboxTokens`'
 * exact box+checkmark treatment for that reason rather than inventing a
 * third checkbox look. Registers its label with `MultiSelect`'s context on
 * mount (for `MultiSelectTrigger`'s summary text), same pattern `SelectItem`
 * establishes for `SelectValue`.
 */
const MultiSelectItem = React.forwardRef<HTMLDivElement, MultiSelectItemProps>(
  (props, forwardedRef) => {
    const { className, children, value, textValue, ...rest } = props;
    const context = useMultiSelectContext('MultiSelectItem');
    const selected = context.value.includes(value);

    React.useEffect(() => {
      const label = textValue ?? (typeof children === 'string' ? children : value);
      context.registerItemLabel(value, label);
      return () => context.unregisterItemLabel(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-registers when the identity of what's registered actually changes
    }, [value, textValue, children]);

    return (
      <ListboxOption
        value={value}
        className={cn(
          'flex cursor-pointer select-none items-center gap-2 rounded-[var(--radius-selector)] px-2 py-1.5 text-sm outline-none focus-visible:bg-[var(--multi-select-item-highlighted-bg)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        <span
          aria-hidden="true"
          className={cn(
            'grid h-4 w-4 shrink-0 place-items-center rounded-[calc(var(--radius-selector)/2)] border border-[var(--checkbox-border)]',
            selected && 'border-[var(--checkbox-checked-bg)] bg-[var(--checkbox-checked-bg)]',
          )}
        >
          {selected ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-[var(--checkbox-icon)]"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : null}
        </span>
        {children}
      </ListboxOption>
    );
  },
);

MultiSelectItem.displayName = 'MultiSelectItem';

export { MultiSelectItem };
export type { MultiSelectItemProps };
