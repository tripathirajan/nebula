import { BalanceCard } from '../dashboard/billing/balance-card';
import { BillingSummaryCard } from '../dashboard/billing/billing-summary-card';
import { PaymentMethodList } from '../dashboard/billing/payment-method-list';
import { ChartCard } from '../dashboard/charts/chart-card';
import { DashboardOverview } from '../dashboard/widgets/dashboard-overview';

import type { Meta, StoryObj } from '@storybook/react';

function ArrowDownCircleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v7m0 0 3-3m-3 3-3-3" />
    </svg>
  );
}

function ArrowUpCircleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-7m0 0-3 3m3-3 3 3" />
    </svg>
  );
}

function PiggyBankIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a5 5 0 0 1 5-5h5l3-2v3.5L19 10v4a2 2 0 0 1-2 2h-1l-1 3H9l-.5-2H7a3 3 0 0 1-3-3z" />
      <circle cx="9" cy="11" r="0.5" fill="currentColor" />
    </svg>
  );
}

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
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <DashboardOverview
          metrics={[
            { label: 'Income', value: '$6,240', icon: <ArrowDownCircleIcon />, color: 'success', trend: { direction: 'up', value: '+4.1%', description: 'vs last month' } },
            { label: 'Expenses', value: '$1,450', icon: <ArrowUpCircleIcon />, color: 'danger', trend: { direction: 'down', value: '-1.8%', description: 'vs last month' } },
            { label: 'Savings', value: '$3,100', icon: <PiggyBankIcon />, color: 'info', trend: { direction: 'up', value: '+6.4%', description: 'vs last month' } },
          ]}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
    </div>
  ),
};
