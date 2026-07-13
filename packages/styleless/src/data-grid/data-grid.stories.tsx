import { expect, within } from '@storybook/test';

import { DataGrid } from './data-grid';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DataGrid> = {
  title: 'Styleless/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const rows = Array.from({ length: 1000 }, (_, index) => ({
  id: String(index),
  name: `Person ${index}`,
  email: `person${index}@example.com`,
}));

const columns = [
  { key: 'name', header: 'Name', render: (row: (typeof rows)[number]) => row.name, width: '12rem' },
  { key: 'email', header: 'Email', render: (row: (typeof rows)[number]) => row.email },
];

// Minimal borders only, via classNames — no design-system tokens, since this
// layer has zero visual opinion. `react-ui`'s own `DataGrid` story is where
// the real themed look lives.
export const Default: Story = {
  args: {
    rows,
    columns,
    height: 320,
    getRowId: (row: (typeof rows)[number]) => row.id,
    classNames: {
      root: 'border border-solid',
      headerRow: 'flex border-b border-solid font-bold',
      headerCell: 'flex-1 p-2',
      row: 'flex border-b border-solid',
      cell: 'flex-1 p-2',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('grid')).toHaveAttribute('aria-rowcount', '1000');
    await expect(canvas.getByText('Person 0')).toBeInTheDocument();
    await expect(canvas.queryByText('Person 999')).not.toBeInTheDocument();
  },
};
