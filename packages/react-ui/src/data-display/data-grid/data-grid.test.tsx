import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DataGrid } from './data-grid';

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

const rows = Array.from({ length: 50 }, (_, index) => ({ id: String(index), name: `Row ${index}` }));
const columns = [{ key: 'name', header: 'Name', render: (row: (typeof rows)[number]) => row.name }];

describe('DataGrid', () => {
  it('renders the WAI-ARIA grid structure and windows the row set', () => {
    render(<DataGrid rows={rows} columns={columns} height={300} getRowId={(row) => row.id} />);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-rowcount', '50');
    expect(screen.getByText('Row 0')).toBeInTheDocument();
    const renderedRows = screen.getAllByRole('row').filter((row) => row.hasAttribute('aria-rowindex'));
    expect(renderedRows.length).toBeLessThan(rows.length);
  });

  it('applies a custom className to the root', () => {
    render(<DataGrid rows={rows} columns={columns} height={300} getRowId={(row) => row.id} className="custom-grid" />);
    expect(screen.getByRole('grid')).toHaveClass('custom-grid');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DataGrid rows={rows} columns={columns} height={300} getRowId={(row) => row.id} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
