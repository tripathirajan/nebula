import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DataTable } from './data-table';
import { DataTableBody } from './data-table-body';
import { DataTableCell } from './data-table-cell';
import { DataTableHead } from './data-table-head';
import { DataTableHeader } from './data-table-header';
import { DataTableRow } from './data-table-row';
import { DataTableSelectAllCell } from './data-table-select-all-cell';
import { DataTableSelectionCell } from './data-table-selection-cell';

const rows = [
  { id: '1', name: 'Alpha' },
  { id: '2', name: 'Bravo' },
];

function Table(props: { onSortChange?: (key: string, direction: 'asc' | 'desc') => void; onSelectedChange?: (ids: string[]) => void; selected?: string[] }) {
  return (
    <DataTable onSortChange={props.onSortChange} onSelectedChange={props.onSelectedChange} selected={props.selected}>
      <DataTableHeader>
        <DataTableRow>
          <DataTableSelectAllCell ids={rows.map((row) => row.id)} />
          <DataTableHead sortKey="name">Name</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {rows.map((row) => (
          <DataTableRow key={row.id} id={row.id} data-testid={`row-${row.id}`}>
            <DataTableSelectionCell id={row.id} aria-label={`Select ${row.name}`} />
            <DataTableCell>{row.name}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}

describe('DataTable', () => {
  it('renders every row', () => {
    render(<Table />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Bravo')).toBeInTheDocument();
  });

  it('sorts on header click', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<Table onSortChange={onSortChange} />);
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('selects a row via its checkbox and tints it', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<Table onSelectedChange={onSelectedChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Select Alpha' }));
    expect(onSelectedChange).toHaveBeenCalledWith(['1']);
  });

  it('marks a controlled-selected row with data-state="selected"', () => {
    render(<Table selected={['1']} />);
    expect(screen.getByTestId('row-1')).toHaveAttribute('data-state', 'selected');
    expect(screen.getByTestId('row-2')).not.toHaveAttribute('data-state');
  });

  it('select-all checkbox is indeterminate when only some rows are selected', () => {
    render(<Table selected={['1']} />);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'data-state',
      'indeterminate',
    );
  });

  it('select-all checkbox selects every row, then clears on a second click', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<Table onSelectedChange={onSelectedChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectedChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Table />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
