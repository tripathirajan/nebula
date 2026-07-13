import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataTable } from './data-table';
import { DataTableHead } from './data-table-head';
import { DataTableRow } from './data-table-row';

describe('DataTable (styleless)', () => {
  it('renders as a real <table>', () => {
    render(
      <DataTable data-testid="table">
        <tbody>
          <tr>
            <td>Row</td>
          </tr>
        </tbody>
      </DataTable>,
    );
    expect(screen.getByTestId('table').tagName).toBe('TABLE');
  });

  it('toggles sort direction on repeated clicks of the same column, resets on a different column', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable onSortChange={onSortChange}>
        <thead>
          <tr>
            <DataTableHead sortKey="name">Name</DataTableHead>
            <DataTableHead sortKey="date">Date</DataTableHead>
          </tr>
        </thead>
      </DataTable>,
    );

    const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenLastCalledWith('name', 'asc');
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenLastCalledWith('name', 'desc');
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

    await user.click(screen.getByRole('button', { name: 'Date' }));
    expect(onSortChange).toHaveBeenLastCalledWith('date', 'asc');
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('marks a selected row with data-state="selected"', () => {
    render(
      <DataTable selected={['row-1']}>
        <tbody>
          <DataTableRow id="row-1" data-testid="row-1" />
          <DataTableRow id="row-2" data-testid="row-2" />
        </tbody>
      </DataTable>,
    );
    expect(screen.getByTestId('row-1')).toHaveAttribute('data-state', 'selected');
    expect(screen.getByTestId('row-2')).not.toHaveAttribute('data-state');
  });

  it('throws when a sub-component is used outside DataTable', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DataTableRow id="row-1" />)).toThrow(
      '`DataTableRow` must be used within a `DataTable`.',
    );
    consoleError.mockRestore();
  });
});
