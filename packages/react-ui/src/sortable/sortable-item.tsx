import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { NEBULA_DRAG_MIME_TYPE } from '../draggable/draggable';

import { useSortableContext } from './sortable-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface SortableItemOwnProps {
  id: string;
  disabled?: boolean;
}

type SortableItemProps = Omit<PrimitivePropsWithRef<'div'>, 'onDrop' | 'onDragOver'> &
  SortableItemOwnProps;

/**
 * One reorderable row/card — both draggable (drag-starts carry its own `id`)
 * and a drop target (a drop from another `SortableItem` in the same
 * `Sortable` moves that item to just before this one, via
 * `sortable-context.ts`'s `moveItem`). See `Sortable`'s doc comment for why
 * this isn't built by literally composing separate `Draggable`+`Droppable`
 * components — the event wiring is identical either way, just inlined here.
 */
const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
  (props, forwardedRef) => {
    const { className, id, disabled = false, ...rest } = props;
    const context = useSortableContext('SortableItem');
    const [dragging, setDragging] = React.useState(false);
    const [over, setOver] = React.useState(false);

    return (
      <Primitive
        as="div"
        draggable={!disabled}
        data-dragging={dragging ? '' : undefined}
        data-over={over ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing',
          'data-[dragging]:opacity-50 data-[over]:outline data-[over]:outline-2 data-[over]:outline-offset-2 data-[over]:outline-[var(--dnd-drop-ring)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
        onDragStart={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          event.dataTransfer.setData(NEBULA_DRAG_MIME_TYPE, id);
          event.dataTransfer.effectAllowed = 'move';
          setDragging(true);
        }}
        onDragEnd={() => setDragging(false)}
        onDragOver={(event) => {
          if (disabled) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
        }}
        onDragEnter={() => {
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => {
          if (!disabled) setOver(false);
        }}
        onDrop={(event) => {
          if (disabled) return;
          event.preventDefault();
          setOver(false);
          const draggedId = event.dataTransfer.getData(NEBULA_DRAG_MIME_TYPE);
          if (draggedId) context.moveItem(draggedId, id);
        }}
      />
    );
  },
);

SortableItem.displayName = 'SortableItem';

export { SortableItem };
export type { SortableItemProps };
