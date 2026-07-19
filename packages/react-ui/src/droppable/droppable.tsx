import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { NEBULA_DRAG_MIME_TYPE } from '../draggable/draggable';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface DroppableOwnProps {
  disabled?: boolean;
  /** Called with the dropped `Draggable`'s `id` once a drop actually lands here — not called for a drag that leaves without dropping. */
  onDrop?: (draggedId: string, event: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * Omits the native `onDrop`/`onDragOver` from the underlying `<div>`'s props
 * entirely, rather than intersecting alongside `DroppableOwnProps`'s own
 * differently-shaped `onDrop` (which takes a dragged id, not a raw
 * `DragEvent`) — this component fully owns that event's meaning, the same
 * way `NavigationMenuContentProps` narrows down to a `Pick` of only the
 * `PopperContentProps` fields it actually re-exposes rather than the full set.
 */
type DroppableProps = Omit<PrimitivePropsWithRef<'div'>, 'onDrop' | 'onDragOver'> &
  DroppableOwnProps;

/**
 * Accepts a `Draggable`'s drop via the native HTML5 Drag and Drop API.
 * `dragover` must call `event.preventDefault()` for `drop` to fire at all —
 * this is a native API quirk, not a design choice, so it's handled here
 * rather than left for every consumer to remember. `data-over` toggles while
 * a compatible drag is currently over this element, for a consumer's own
 * "you can drop here" highlight styling.
 *
 * @example
 * ```tsx
 * <Droppable onDrop={(id) => moveCardTo(id, 'done')}>Done</Droppable>
 * ```
 */
const Droppable = React.forwardRef<HTMLDivElement, DroppableProps>((props, forwardedRef) => {
  const { className, disabled = false, onDrop, onDragEnter, onDragLeave, ...rest } = props;
  const [over, setOver] = React.useState(false);

  return (
    <Primitive
      as="div"
      data-over={over ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        'data-[over]:outline data-[over]:outline-2 data-[over]:outline-offset-2 data-[over]:outline-[var(--dnd-drop-ring)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
      onDragOver={(event) => {
        if (disabled) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }}
      onDragEnter={(event) => {
        onDragEnter?.(event);
        if (!disabled) setOver(true);
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event);
        if (!disabled) setOver(false);
      }}
      onDrop={(event) => {
        if (disabled) return;
        event.preventDefault();
        setOver(false);
        const draggedId = event.dataTransfer.getData(NEBULA_DRAG_MIME_TYPE);
        if (draggedId) onDrop?.(draggedId, event);
      }}
    />
  );
});

Droppable.displayName = 'Droppable';

export { Droppable };
export type { DroppableProps };
