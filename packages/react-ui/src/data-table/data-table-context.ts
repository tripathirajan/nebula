import * as React from 'react';

type SortDirection = 'asc' | 'desc';

interface DataTableContextValue {
  sortKey: string | undefined;
  sortDirection: SortDirection;
  /** Toggles sorting on `key` — same key again flips direction, a different key resets to `'asc'`. */
  onSort: (key: string) => void;
  isSelected: (id: string) => boolean;
  toggleSelected: (id: string) => void;
  /** Replaces the whole selection — used by `DataTableSelectAllCell`'s checkbox rather than a per-id loop. */
  setSelected: (ids: string[]) => void;
  selected: string[];
}

/** Plain context — see `carousel-context.ts`'s header comment for why this doesn't use `createContextScope`. */
const DataTableContext = React.createContext<DataTableContextValue | undefined>(undefined);

function useDataTableContext(consumerName: string): DataTableContextValue {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within a \`DataTable\`.`);
  }
  return context;
}

export { DataTableContext, useDataTableContext };
export type { DataTableContextValue, SortDirection };
