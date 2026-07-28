import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Draggable, NEBULA_DRAG_MIME_TYPE } from './draggable';

/** jsdom's `DataTransfer` doesn't implement `setData`/`getData` fully — same
 * class of gap as `window.matchMedia`, worked around with a minimal mock
 * rather than a global polyfill since drag-and-drop tests are the only
 * consumer of this specific API surface in the repo. */
function createDataTransfer() {
  const store = new Map<string, string>();
  return {
    setData: vi.fn((type: string, value: string) => store.set(type, value)),
    getData: vi.fn((type: string) => store.get(type) ?? ''),
    effectAllowed: '',
    dropEffect: '',
  };
}

describe('Draggable', () => {
  it('is draggable by default', () => {
    render(<Draggable id="card-1">Card one</Draggable>);
    expect(screen.getByText('Card one')).toHaveAttribute('draggable', 'true');
  });

  it('is not draggable when disabled', () => {
    render(
      <Draggable id="card-1" disabled>
        Card one
      </Draggable>,
    );
    const el = screen.getByText('Card one');
    expect(el).toHaveAttribute('draggable', 'false');
    expect(el).toHaveAttribute('data-disabled', '');
  });

  it('writes its id to the dataTransfer and sets data-dragging on dragstart, clears it on dragend', () => {
    render(<Draggable id="card-1">Card one</Draggable>);
    const el = screen.getByText('Card one');
    const dataTransfer = createDataTransfer();

    fireEvent.dragStart(el, { dataTransfer });
    expect(dataTransfer.setData).toHaveBeenCalledWith(NEBULA_DRAG_MIME_TYPE, 'card-1');
    expect(dataTransfer.effectAllowed).toBe('move');
    expect(el).toHaveAttribute('data-dragging', '');

    fireEvent.dragEnd(el, { dataTransfer });
    expect(el).not.toHaveAttribute('data-dragging');
  });

  it('prevents dragstart and never sets data-dragging when disabled', () => {
    render(
      <Draggable id="card-1" disabled>
        Card one
      </Draggable>,
    );
    const el = screen.getByText('Card one');
    const dataTransfer = createDataTransfer();

    const event = fireEvent.dragStart(el, { dataTransfer });
    expect(event).toBe(false); // fireEvent returns false when preventDefault() was called
    expect(dataTransfer.setData).not.toHaveBeenCalled();
    expect(el).not.toHaveAttribute('data-dragging');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Draggable id="card-1">Card one</Draggable>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
