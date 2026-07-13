import { BillingSummaryCard } from './billing-summary-card';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Billing/Billing Summary Card',
  component: BillingSummaryCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BillingSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Storage',
    description: '20 GB plan',
    items: [
      { label: 'Documents', value: 8, max: 20, color: 'primary', formatValue: (v, m) => `${v} GB of ${m} GB` },
      { label: 'Images', value: 5, max: 20, color: 'info', formatValue: (v, m) => `${v} GB of ${m} GB` },
      { label: 'Videos', value: 3, max: 20, color: 'success', formatValue: (v, m) => `${v} GB of ${m} GB` },
      { label: 'Other', value: 1, max: 20, color: 'neutral', formatValue: (v, m) => `${v} GB of ${m} GB` },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <BillingSummaryCard {...args} />
    </div>
  ),
};
