import { BalanceCard } from '../dashboard/billing/balance-card';
import { BillingSummaryCard } from '../dashboard/billing/billing-summary-card';
import { PaymentMethodList } from '../dashboard/billing/payment-method-list';
import { ChartCard } from '../dashboard/charts/chart-card';

import type { Meta, StoryObj } from '@storybook/react';

// Assembled-page story — see saas-dashboard-home.stories.tsx's header
// comment for the "Assembled Page" pattern (BLOCKS_ARCHITECTURE.md §9).
// No component of its own; every piece here already ships independently.
const meta = {
  title: 'Blocks/Compositions/Banking Home',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const balanceHistory = [
  { month: 'Jan', balance: 18400 },
  { month: 'Feb', balance: 19800 },
  { month: 'Mar', balance: 17200 },
  { month: 'Apr', balance: 21100 },
  { month: 'May', balance: 23600 },
  { month: 'Jun', balance: 24500 },
];

const spendingByCategory = [
  { category: 'Groceries', amount: 620 },
  { category: 'Transport', amount: 240 },
  { category: 'Dining', amount: 380 },
  { category: 'Utilities', amount: 210 },
];

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--color-base-200)] p-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <BalanceCard
            label="Total balance"
            amount="$24,500.00"
            description="+2.5% from last month"
            actions={[
              { label: 'Send', onClick: () => {} },
              { label: 'Top up', onClick: () => {} },
            ]}
          />
          <ChartCard
            title="Balance history"
            description="Last 6 months"
            type="line"
            data={balanceHistory}
            categoryKey="month"
            series={[{ key: 'balance', label: 'Balance', color: 'primary' }]}
          />
          <ChartCard
            title="Spending by category"
            description="This month"
            type="donut"
            data={spendingByCategory}
            valueKey="amount"
            nameKey="category"
          />
        </div>
        <div className="flex flex-col gap-6">
          <BillingSummaryCard
            title="Monthly budget"
            description="$2,000 limit"
            items={[
              { label: 'Groceries', value: 620, max: 800, color: 'primary', formatValue: (v, m) => `$${v} of $${m}` },
              { label: 'Transport', value: 240, max: 300, color: 'info', formatValue: (v, m) => `$${v} of $${m}` },
              { label: 'Dining', value: 380, max: 400, color: 'warning', formatValue: (v, m) => `$${v} of $${m}` },
            ]}
          />
          <PaymentMethodList
            methods={[
              { id: '1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
              { id: '2', brand: 'Mastercard', last4: '8210', expiry: '11/26' },
            ]}
            onSetDefault={() => {}}
            onRemove={() => {}}
            onAdd={() => {}}
          />
        </div>
      </div>
    </div>
  ),
};
