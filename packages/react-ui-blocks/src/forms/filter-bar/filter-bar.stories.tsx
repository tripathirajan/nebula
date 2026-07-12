import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { FilterBar } from './filter-bar';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Forms/Filter Bar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: [
      { id: 'status', label: 'Status: Active' },
      { id: 'team', label: 'Team: Design' },
    ],
  },
};

export const WithAddAndClear: Story = {
  // `filters` is a required prop, but this story manages its own local
  // state via `render` — `args` is unused, just satisfying the required type.
  args: { filters: [] },
  render: () => {
    function Demo() {
      const [filters, setFilters] = useState([{ id: 'status', label: 'Status: Active' }]);
      const options = [
        { id: 'owner', label: 'Owner' },
        { id: 'priority', label: 'Priority' },
      ];
      return (
        <FilterBar
          filters={filters}
          onRemoveFilter={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
          onClearAll={() => setFilters([])}
          addOptions={options}
          onAddFilter={(id) => {
            const option = options.find((o) => o.id === id);
            if (option) setFilters((current) => [...current, option]);
          }}
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Status: Active')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Add filter' }));
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Owner' }));
    await expect(canvas.getByText('Owner')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Clear all' }));
    await expect(canvas.queryByText('Status: Active')).not.toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { filters: [] },
};
