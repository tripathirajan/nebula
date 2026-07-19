import { MenuItem } from '@nebula-lab/react-ui/menu';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DataTableBlock } from './data-table-block';

interface Row {
  id: string;
  name: string;
}

const rows: Row[] = [
  { id: '1', name: 'Angelique Morse' },
  { id: '2', name: 'Ariana Lang' },
];

const columns = [{ key: 'name', header: 'Name', render: (row: Row) => row.name }];

describe('DataTableBlock (block)', () => {
  it('renders a row per data item with its column values', () => {
    render(<DataTableBlock columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.getByText('Angelique Morse')).toBeInTheDocument();
    expect(screen.getByText('Ariana Lang')).toBeInTheDocument();
  });

  it('renders an empty state when there are no rows', () => {
    render(<DataTableBlock columns={columns} rows={[]} getRowId={(row) => row.id} />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders a custom empty state when provided', () => {
    render(
      <DataTableBlock
        columns={columns}
        rows={[]}
        getRowId={(row) => row.id}
        emptyState={<div>Nothing here yet</div>}
      />,
    );
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('omits the tab bar when tabs is omitted', () => {
    render(<DataTableBlock columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.queryByRole('group', { name: 'Filter by status' })).not.toBeInTheDocument();
  });

  it('renders status tabs with count badges and reports the active tab', () => {
    const onActiveTabChange = vi.fn();
    render(
      <DataTableBlock
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        tabs={[
          { value: 'all', label: 'All', count: 2 },
          { value: 'active', label: 'Active', count: 1 },
        ]}
        activeTab="all"
        onActiveTabChange={onActiveTabChange}
      />,
    );
    expect(screen.getByRole('button', { name: /All/ })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Active/ }));
    expect(onActiveTabChange).toHaveBeenCalledWith('active');
  });

  it('omits the toolbar row when no search/filters/actions are given', () => {
    render(<DataTableBlock columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('reports search input changes', () => {
    const onSearchChange = vi.fn();
    render(
      <DataTableBlock
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        searchValue=""
        onSearchChange={onSearchChange}
      />,
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Ari' } });
    expect(onSearchChange).toHaveBeenCalledWith('Ari');
  });

  it('renders a selection checkbox per row only when selectable', () => {
    const { rerender } = render(<DataTableBlock columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

    rerender(<DataTableBlock columns={columns} rows={rows} getRowId={(row) => row.id} selectable />);
    // One "select all" header checkbox + one per row.
    expect(screen.getAllByRole('checkbox')).toHaveLength(rows.length + 1);
  });

  it('renders a row actions menu only when rowActions is given', () => {
    const { rerender } = render(<DataTableBlock columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.queryByRole('button', { name: /Row actions/ })).not.toBeInTheDocument();

    rerender(
      <DataTableBlock
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        rowActions={() => <MenuItem onSelect={() => {}}>Edit</MenuItem>}
      />,
    );
    expect(screen.getAllByRole('button', { name: 'Row actions' })).toHaveLength(rows.length);
  });

  it('omits the pagination footer when totalCount is omitted', () => {
    render(<DataTableBlock columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.queryByText(/Rows per page/)).not.toBeInTheDocument();
  });

  it('renders the pagination footer and range text when totalCount is given', () => {
    render(
      <DataTableBlock
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        page={1}
        pageSize={10}
        totalCount={2}
      />,
    );
    expect(screen.getByText('Rows per page:')).toBeInTheDocument();
    expect(screen.getByText('1–2 of 2')).toBeInTheDocument();
  });

  function mockMatchMedia(matches: boolean) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  it('renders the table (not a card list) when renderCard is omitted, regardless of viewport', () => {
    mockMatchMedia(false);
    render(<DataTableBlock columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders a stacked card list instead of the table below cardBreakpoint when renderCard is given', () => {
    mockMatchMedia(false);
    render(
      <DataTableBlock
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        renderCard={(row) => <div data-testid={`card-${row.id}`}>{row.name}</div>}
      />,
    );
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
  });

  it('renders the table instead of the card list at/above cardBreakpoint when renderCard is given', () => {
    mockMatchMedia(true);
    render(
      <DataTableBlock
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        renderCard={(row) => <div data-testid={`card-${row.id}`}>{row.name}</div>}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByTestId('card-1')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DataTableBlock
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        tabs={[{ value: 'all', label: 'All', count: 2 }]}
        activeTab="all"
        searchValue=""
        onSearchChange={() => {}}
        selectable
        page={1}
        totalCount={2}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
