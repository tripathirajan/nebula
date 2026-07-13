import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DataGrid } from './data-grid';

// jsdom does no real layout — a real `ResizeObserver` never fires (or, if
// jsdom's own stub exists at all, never reports a real `contentRect`), so
// `useVirtualizer`'s `viewportSize` would stay `0` forever and
// `virtualItems` would always be empty. Stubbing a `ResizeObserver` that
// synchronously reports a fixed height, same technique this class of
// virtualization test needs regardless of library, lets rows actually
// render for real assertions instead of only checking the static header.
class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback(
      [{ target, contentRect: { height: 300 } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

const rows = Array.from({ length: 50 }, (_, index) => ({ id: String(index), name: `Row ${index}` }));

const columns = [{ key: 'name', header: 'Name', render: (row: (typeof rows)[number]) => row.name }];

describe('DataGrid (styleless)', () => {
  it('renders the WAI-ARIA grid structure with the correct row/column counts', () => {
    render(<DataGrid rows={rows} columns={columns} height={300} getRowId={(row) => row.id} />);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-rowcount', '50');
    expect(grid).toHaveAttribute('aria-colcount', '1');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('only renders a windowed slice of rows, not all 50', () => {
    render(<DataGrid rows={rows} columns={columns} height={300} estimateRowHeight={40} getRowId={(row) => row.id} />);
    const renderedRows = screen.getAllByRole('row').filter((row) => row.hasAttribute('aria-rowindex'));
    expect(renderedRows.length).toBeGreaterThan(0);
    expect(renderedRows.length).toBeLessThan(rows.length);
  });

  it('renders visible rows with the correct content and 1-based aria-rowindex', () => {
    render(<DataGrid rows={rows} columns={columns} height={300} getRowId={(row) => row.id} />);
    expect(screen.getByText('Row 0')).toBeInTheDocument();
    const firstRow = screen.getAllByRole('row').find((row) => row.hasAttribute('aria-rowindex'));
    expect(firstRow).toHaveAttribute('aria-rowindex', '1');
  });

  it('applies classNames to each part', () => {
    render(
      <DataGrid
        rows={rows}
        columns={columns}
        height={300}
        getRowId={(row) => row.id}
        classNames={{ root: 'root-class', headerCell: 'header-cell-class' }}
      />,
    );
    expect(screen.getByRole('grid').className).toBe('root-class');
    expect(screen.getByRole('columnheader', { name: 'Name' }).className).toBe('header-cell-class');
  });
});
