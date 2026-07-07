import * as React from 'react';

import { useSelectContext } from './select-context';

import type { ScopedProps } from './select-context';

const SELECT_VALUE_NAME = 'SelectValue';

interface SelectValueProps {
  /** Rendered when nothing is selected yet. */
  placeholder?: React.ReactNode;
}

/**
 * Displays the currently selected `SelectItem`'s label (its `textValue`, or
 * its plain-string `children` — see `SelectItem`), or `placeholder` when
 * nothing is selected. Doesn't render a DOM element of its own — it's
 * rendered as `SelectTrigger`'s child, so its text becomes part of the
 * trigger button's own accessible name.
 *
 * @example
 * ```tsx
 * <SelectTrigger>
 *   <SelectValue placeholder="Pick a fruit" />
 * </SelectTrigger>
 * ```
 */
const SelectValue = (props: ScopedProps<SelectValueProps>) => {
  const { __scopeSelect, placeholder } = props;
  const context = useSelectContext(SELECT_VALUE_NAME, __scopeSelect);
  const label = context.value ? context.getItemLabel(context.value) : undefined;

  return <>{label ?? placeholder}</>;
};

export { SelectValue };
export type { SelectValueProps };
