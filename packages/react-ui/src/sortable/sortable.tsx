import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { SortableContext } from './sortable-context';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface SortableOwnProps {
  /** The list's current order, by id — the source of truth `SortableItem`s reorder against. */
  items: string[];
  onReorder: (items: string[]) => void;
  /** Purely a layout hint for the built-in `flex-col`/`flex-row` styling — reordering logic itself doesn't depend on it. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
}

type SortableProps = PrimitivePropsWithRef<'div'> & SortableOwnProps;

/**
 * Root of the Sortable compound component — reorders a list of
 * `SortableItem`s by combining `Draggable`'s drag-start and `Droppable`'s
 * drop-target behavior directly into each item (rather than composing
 * separate `Draggable`/`Droppable` components under the hood), since a
 * sortable item is always both at once: everything it's built on is the
 * same native HTML5 Drag and Drop API `Draggable`/`Droppable` use, including
 * their same keyboard-support limitation (see `Draggable`'s doc comment).
 *
 * Reordering itself is computed here (`moveItem` in `sortable-context.ts`)
 * from wherever `event.dataTransfer` says the drag started versus which
 * `SortableItem` it was dropped on — this component never re-sorts `items`
 * on its own; it always calls `onReorder` and expects the consumer to feed
 * the new order back in as `items`, same "controlled, consumer owns the
 * source of truth" convention every other stateful primitive in this
 * project uses.
 *
 * @example
 * ```tsx
 * const [items, setItems] = useState(['a', 'b', 'c']);
 * <Sortable items={items} onReorder={setItems}>
 *   {items.map((id) => <SortableItem key={id} id={id}>{id}</SortableItem>)}
 * </Sortable>
 * ```
 */
const Sortable = React.forwardRef<HTMLDivElement, SortableProps>((props, forwardedRef) => {
  const { className, items, onReorder, orientation = 'vertical', ...rest } = props;

  const moveItem = React.useCallback(
    (draggedId: string, overId: string) => {
      if (draggedId === overId) return;
      const draggedIndex = items.indexOf(draggedId);
      const overIndex = items.indexOf(overId);
      if (draggedIndex === -1 || overIndex === -1) return;

      const next = items.filter((item) => item !== draggedId);
      const insertAt = next.indexOf(overId);
      next.splice(insertAt, 0, draggedId);
      onReorder(next);
    },
    [items, onReorder],
  );

  const contextValue = React.useMemo(() => ({ moveItem }), [moveItem]);

  return (
    <SortableContext.Provider value={contextValue}>
      <Primitive
        as="div"
        data-orientation={orientation}
        className={cn('flex data-[orientation=vertical]:flex-col data-[orientation=horizontal]:flex-row', className)}
        {...rest}
        ref={forwardedRef}
      />
    </SortableContext.Provider>
  );
});

Sortable.displayName = 'Sortable';

export { Sortable };
export type { SortableProps };
