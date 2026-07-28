import * as React from 'react';

interface SortableContextValue {
  /** Moves `draggedId` to just before `overId` in the list and calls `Sortable`'s `onReorder` with the resulting order — a no-op if either id isn't in the current list, or if they're the same id. */
  moveItem: (draggedId: string, overId: string) => void;
}

/** Plain context — see `carousel-context.ts`'s header comment for why this doesn't use `createContextScope`. */
const SortableContext = React.createContext<SortableContextValue | undefined>(undefined);

function useSortableContext(consumerName: string): SortableContextValue {
  const context = React.useContext(SortableContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within a \`Sortable\`.`);
  }
  return context;
}

export { SortableContext, useSortableContext };
export type { SortableContextValue };
