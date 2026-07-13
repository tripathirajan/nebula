import { BalanceCard } from './balance-card';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Billing/Balance Card',
  component: BalanceCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BalanceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Total balance',
    amount: '$24,500.00',
    description: '+2.5% from last month',
    actions: [
      { label: 'Send', onClick: () => {} },
      { label: 'Top up', onClick: () => {} },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <BalanceCard {...args} />
    </div>
  ),
};

export const NoActions: Story = {
  args: {
    label: 'Available credit',
    amount: '$1,240.00',
  },
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <BalanceCard {...args} />
    </div>
  ),
};
