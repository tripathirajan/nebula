import * as React from 'react';

interface MultiSelectContextValue {
  value: string[];
  /** Replaces the full selected-value array — `Listbox` (`type="multiple"`) already computes the next array itself when an option is toggled, so this only needs to accept it, not recompute a single toggle. */
  setValue: (value: string[]) => void;
  disabled: boolean;
  registerItemLabel: (itemValue: string, label: string) => void;
  unregisterItemLabel: (itemValue: string) => void;
  getItemLabel: (itemValue: string) => string | undefined;
}

// A plain `React.createContext`, not `@nebula/primitives`' `createContextScope`
// — same reasoning `Carousel`/`DataTable`'s own contexts document: nothing
// else in this workspace ever needs to compose another component into a
// `MultiSelect` instance's scope, so the extra scoping machinery would be
// pure overhead here.
const MultiSelectContext = React.createContext<MultiSelectContextValue | undefined>(undefined);

function useMultiSelectContext(componentName: string): MultiSelectContextValue {
  const context = React.useContext(MultiSelectContext);
  if (!context) {
    throw new Error(`\`${componentName}\` must be rendered inside a \`MultiSelect\`.`);
  }
  return context;
}

export { MultiSelectContext, useMultiSelectContext };
export type { MultiSelectContextValue };
