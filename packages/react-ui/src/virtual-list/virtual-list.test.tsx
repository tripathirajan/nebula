import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { VirtualList } from './virtual-list';

class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback([{ target, contentRect: { height: 300 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

const items = Array.from({ length: 500 }, (_, index) => ({ id: String(index), label: `Item ${index}` }));

describe('VirtualList', () => {
  it('renders role="list" and only a windowed slice of items, not all 500', () => {
    render(
      <VirtualList
        items={items}
        height={300}
        getItemId={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
      />,
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Item 0')).toBeInTheDocument();
    const renderedRows = screen.getAllByRole('listitem');
    expect(renderedRows.length).toBeGreaterThan(0);
    expect(renderedRows.length).toBeLessThan(items.length);
  });

  it('applies className to the scroll container and itemClassName to each row', () => {
    render(
      <VirtualList
        items={items}
        height={300}
        getItemId={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        className="custom-list"
        itemClassName="custom-row"
      />,
    );
    expect(screen.getByRole('list')).toHaveClass('custom-list');
    expect(screen.getAllByRole('listitem')[0]).toHaveClass('custom-row');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <VirtualList
        items={items}
        height={300}
        getItemId={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
