import { expect, userEvent, within } from '@storybook/test';

import { DataTable } from './data-table';
import { DataTableHead } from './data-table-head';
import { DataTableRow } from './data-table-row';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DataTable> = {
  title: 'Styleless/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { id: '1', name: 'Alpha', date: '2026-01-01' },
  { id: '2', name: 'Bravo', date: '2026-02-01' },
];

// Minimal borders only, via inline style — no design-system tokens, since
// this layer has zero visual opinion. `react-ui`'s own `DataTable` story is
// where the real themed look lives.
const cellStyle = { border: '1px solid #ccc', padding: 4 };

export const Default: Story = {
  args: { defaultSortKey: 'name' },
  render: (args) => (
    <DataTable {...args} style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <DataTableHead sortKey="name" style={cellStyle}>
            Name
          </DataTableHead>
          <DataTableHead sortKey="date" style={cellStyle}>
            Date
          </DataTableHead>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <DataTableRow key={row.id} id={row.id}>
            <td style={cellStyle}>{row.name}</td>
            <td style={cellStyle}>{row.date}</td>
          </DataTableRow>
        ))}
      </tbody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHeader = canvas.getByRole('columnheader', { name: 'Name' });
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    await userEvent.click(canvas.getByRole('button', { name: 'Name' }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  },
};
