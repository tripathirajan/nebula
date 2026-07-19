import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

/** The MIME type this project's drag-and-drop components read/write on `DataTransfer` — namespaced so a page with its own unrelated native drag-and-drop doesn't collide with it. */
const NEBULA_DRAG_MIME_TYPE = 'application/x-nebula-drag-id';

interface DraggableOwnProps {
  /** Identifies this item to whatever `Droppable`/`SortableItem` it's dropped onto. */
  id: string;
  disabled?: boolean;
}

type DraggableProps = PrimitivePropsWithRef<'div'> & DraggableOwnProps;

/**
 * Makes its content draggable via the native HTML5 Drag and Drop API
 * (`draggable`, `dragstart`/`dragend`) — built directly in `react-ui`, no
 * `@nebula-lab/headless` layer underneath (project owner decision, see
 * `AGENTS.md`'s `react-ui` row): drag-and-drop *is* its own behavior, but
 * the native API it's built on has no ARIA semantics of its own to
 * decouple from styling the way `Dialog`/`Menu`/etc. do.
 *
 * **Known limitation, not an oversight**: the native HTML5 Drag and Drop API
 * is fundamentally mouse/touch-only — there's no keyboard equivalent to
 * "pick this up and drop it elsewhere" built into the browser the way
 * Tab/Enter/Space are for buttons. A fully keyboard-accessible reorder UI
 * needs an *additional*, non-drag affordance layered on top by the consumer
 * (e.g. explicit "move up"/"move down" buttons) — this component doesn't
 * attempt to fake keyboard drag support, since a half-working keyboard
 * story would be worse than clearly having none.
 *
 * @example
 * ```tsx
 * <Draggable id="card-1">Card one</Draggable>
 * ```
 */
const Draggable = React.forwardRef<HTMLDivElement, DraggableProps>((props, forwardedRef) => {
  const { className, id, disabled = false, onDragStart, onDragEnd, ...rest } = props;
  const [dragging, setDragging] = React.useState(false);

  return (
    <Primitive
      as="div"
      draggable={!disabled}
      data-dragging={dragging ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing',
        'data-[dragging]:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
      onDragStart={(event) => {
        onDragStart?.(event);
        if (disabled) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData(NEBULA_DRAG_MIME_TYPE, id);
        event.dataTransfer.effectAllowed = 'move';
        setDragging(true);
      }}
      onDragEnd={(event) => {
        onDragEnd?.(event);
        setDragging(false);
      }}
    />
  );
});

Draggable.displayName = 'Draggable';

export { Draggable, NEBULA_DRAG_MIME_TYPE };
export type { DraggableProps };
