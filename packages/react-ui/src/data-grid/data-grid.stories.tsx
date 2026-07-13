import { expect, within } from '@storybook/test';

import { DataGrid } from './data-grid';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DataGrid> = {
  title: 'React UI/DataGrid',
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
  role: index % 3 === 0 ? 'Admin' : index % 3 === 1 ? 'Editor' : 'Viewer',
}));

const columns = [
  { key: 'name', header: 'Name', render: (row: (typeof rows)[number]) => row.name, width: '12rem' },
  { key: 'email', header: 'Email', render: (row: (typeof rows)[number]) => row.email },
  { key: 'role', header: 'Role', render: (row: (typeof rows)[number]) => row.role, width: '8rem' },
];

export const Default: Story = {
  args: {
    rows,
    columns,
    height: 400,
    getRowId: (row: (typeof rows)[number]) => row.id,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('grid')).toHaveAttribute('aria-rowcount', '1000');
    await expect(canvas.getByText('Person 0')).toBeInTheDocument();
    await expect(canvas.queryByText('Person 999')).not.toBeInTheDocument();
  },
};
