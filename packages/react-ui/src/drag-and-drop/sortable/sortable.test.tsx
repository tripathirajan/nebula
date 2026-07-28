import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NEBULA_DRAG_MIME_TYPE } from '../draggable/draggable';

import { Sortable } from './sortable';
import { SortableItem } from './sortable-item';

function createDataTransfer(seed: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(seed));
  return {
    setData: vi.fn((type: string, value: string) => store.set(type, value)),
    getData: vi.fn((type: string) => store.get(type) ?? ''),
    effectAllowed: '',
    dropEffect: '',
  };
}

function DemoSortable(props: { items: string[]; onReorder: (items: string[]) => void; disabledIds?: string[] }) {
  const { items, onReorder, disabledIds = [] } = props;
  return (
    <Sortable items={items} onReorder={onReorder}>
      {items.map((id) => (
        <SortableItem key={id} id={id} disabled={disabledIds.includes(id)}>
          {id}
        </SortableItem>
      ))}
    </Sortable>
  );
}

describe('Sortable', () => {
  it('renders every item in order with data-orientation on the root', () => {
    const { container } = render(<DemoSortable items={['a', 'b', 'c']} onReorder={() => {}} />);
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
  });

  it('reorders on drop: dragging "a" onto "c" moves it to just before "c"', () => {
    const onReorder = vi.fn();
    render(<DemoSortable items={['a', 'b', 'c']} onReorder={onReorder} />);
    const dataTransfer = createDataTransfer({ [NEBULA_DRAG_MIME_TYPE]: 'a' });

    fireEvent.dragStart(screen.getByText('a'), { dataTransfer });
    fireEvent.dragEnter(screen.getByText('c'), { dataTransfer });
    fireEvent.drop(screen.getByText('c'), { dataTransfer });

    expect(onReorder).toHaveBeenCalledWith(['b', 'a', 'c']);
  });

  it('is a no-op when an item is dropped on itself', () => {
    const onReorder = vi.fn();
    render(<DemoSortable items={['a', 'b', 'c']} onReorder={onReorder} />);
    const dataTransfer = createDataTransfer({ [NEBULA_DRAG_MIME_TYPE]: 'a' });

    fireEvent.dragStart(screen.getByText('a'), { dataTransfer });
    fireEvent.drop(screen.getByText('a'), { dataTransfer });

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('sets data-dragging on drag start and clears it on drag end', () => {
    render(<DemoSortable items={['a', 'b']} onReorder={() => {}} />);
    const item = screen.getByText('a');
    const dataTransfer = createDataTransfer();

    fireEvent.dragStart(item, { dataTransfer });
    expect(item).toHaveAttribute('data-dragging', '');

    fireEvent.dragEnd(item);
    expect(item).not.toHaveAttribute('data-dragging');
  });

  it('ignores drag/drop entirely on a disabled item', () => {
    const onReorder = vi.fn();
    render(<DemoSortable items={['a', 'b', 'c']} onReorder={onReorder} disabledIds={['b']} />);
    const disabledItem = screen.getByText('b');
    expect(disabledItem).toHaveAttribute('draggable', 'false');
    expect(disabledItem).toHaveAttribute('data-disabled', '');

    const dataTransfer = createDataTransfer({ [NEBULA_DRAG_MIME_TYPE]: 'a' });
    fireEvent.dragStart(screen.getByText('a'), { dataTransfer });
    fireEvent.drop(disabledItem, { dataTransfer });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoSortable items={['a', 'b', 'c']} onReorder={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
