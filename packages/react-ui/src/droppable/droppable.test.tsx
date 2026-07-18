import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NEBULA_DRAG_MIME_TYPE } from '../draggable/draggable';

import { Droppable } from './droppable';

function createDataTransfer(seed: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(seed));
  return {
    setData: vi.fn((type: string, value: string) => store.set(type, value)),
    getData: vi.fn((type: string) => store.get(type) ?? ''),
    effectAllowed: '',
    dropEffect: '',
  };
}

describe('Droppable', () => {
  it('sets data-over on dragenter and clears it on dragleave', () => {
    render(<Droppable>Done</Droppable>);
    const el = screen.getByText('Done');

    fireEvent.dragEnter(el, { dataTransfer: createDataTransfer() });
    expect(el).toHaveAttribute('data-over', '');

    fireEvent.dragLeave(el, { dataTransfer: createDataTransfer() });
    expect(el).not.toHaveAttribute('data-over');
  });

  it('prevents the default on dragover so drop can fire, and sets dropEffect', () => {
    render(<Droppable>Done</Droppable>);
    const dataTransfer = createDataTransfer();
    const event = fireEvent.dragOver(screen.getByText('Done'), { dataTransfer });
    expect(event).toBe(false); // preventDefault() was called
    expect(dataTransfer.dropEffect).toBe('move');
  });

  it('calls onDrop with the dragged id and clears data-over', () => {
    const onDrop = vi.fn();
    render(<Droppable onDrop={onDrop}>Done</Droppable>);
    const el = screen.getByText('Done');
    const dataTransfer = createDataTransfer({ [NEBULA_DRAG_MIME_TYPE]: 'card-1' });

    fireEvent.dragEnter(el, { dataTransfer });
    fireEvent.drop(el, { dataTransfer });

    expect(onDrop).toHaveBeenCalledWith('card-1', expect.anything());
    expect(el).not.toHaveAttribute('data-over');
  });

  it('does not call onDrop for a drop with no matching dataTransfer id', () => {
    const onDrop = vi.fn();
    render(<Droppable onDrop={onDrop}>Done</Droppable>);
    fireEvent.drop(screen.getByText('Done'), { dataTransfer: createDataTransfer() });
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('ignores drag events entirely when disabled', () => {
    const onDrop = vi.fn();
    render(
      <Droppable disabled onDrop={onDrop}>
        Done
      </Droppable>,
    );
    const el = screen.getByText('Done');
    expect(el).toHaveAttribute('data-disabled', '');

    fireEvent.dragEnter(el, { dataTransfer: createDataTransfer() });
    expect(el).not.toHaveAttribute('data-over');

    fireEvent.drop(el, { dataTransfer: createDataTransfer({ [NEBULA_DRAG_MIME_TYPE]: 'card-1' }) });
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Droppable>Done</Droppable>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
