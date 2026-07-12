import { RankedList } from './ranked-list';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Widgets/Ranked List',
  component: RankedList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RankedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Top products',
    items: [
      { id: '1', label: 'Wireless earbuds', value: '$12,450' },
      { id: '2', label: 'Smart watch', value: '$9,800' },
      { id: '3', label: 'Bluetooth speaker', value: '$6,220' },
      { id: '4', label: 'Laptop stand', value: '$3,410' },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <RankedList {...args} />
    </div>
  ),
};

export const WithExplicitRanks: Story = {
  name: 'Explicit rank (slice of a larger list)',
  args: {
    title: 'Top countries by revenue',
    items: [
      { id: '1', rank: 8, label: 'United States', value: '$42,100' },
      { id: '2', rank: 9, label: 'Germany', value: '$18,900' },
      { id: '3', rank: 10, label: 'Japan', value: '$15,200' },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <RankedList {...args} />
    </div>
  ),
};
