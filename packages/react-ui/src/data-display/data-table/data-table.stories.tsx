import { useState } from 'react';

import { DataTable } from './data-table';
import { DataTableBody } from './data-table-body';
import { DataTableCell } from './data-table-cell';
import { DataTableHead } from './data-table-head';
import { DataTableHeader } from './data-table-header';
import { DataTableRow } from './data-table-row';
import { DataTableSelectAllCell } from './data-table-select-all-cell';
import { DataTableSelectionCell } from './data-table-selection-cell';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/DataTable',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { id: '1', name: 'Cloud Runner', price: '$89.00' },
  { id: '2', name: 'Trail Glide', price: '$64.00' },
  { id: '3', name: 'Street Pulse', price: '$74.00' },
];

function Demo() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <DataTable defaultSortKey="name" selected={selected} onSelectedChange={setSelected}>
      <DataTableHeader>
        <DataTableRow>
          <DataTableSelectAllCell ids={rows.map((row) => row.id)} />
          <DataTableHead sortKey="name">Name</DataTableHead>
          <DataTableHead sortKey="price">Price</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {rows.map((row) => (
          <DataTableRow key={row.id} id={row.id}>
            <DataTableSelectionCell id={row.id} aria-label={`Select ${row.name}`} />
            <DataTableCell>{row.name}</DataTableCell>
            <DataTableCell>{row.price}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};
