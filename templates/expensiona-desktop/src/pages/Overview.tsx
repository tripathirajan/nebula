import { ChartCard, DashboardOverview, WelcomeBanner } from '@nebula-lab/react-ui-blocks/dashboard';

import { PiggyBankIcon, TrendDownIcon, TrendUpIcon, WalletIcon } from '../icons';

const monthlyIncomeExpense = [
  { month: 'Jan', income: 5200, expense: 3800 },
  { month: 'Feb', income: 5200, expense: 4100 },
  { month: 'Mar', income: 5400, expense: 3600 },
  { month: 'Apr', income: 5200, expense: 4400 },
  { month: 'May', income: 6100, expense: 3900 },
  { month: 'Jun', income: 5800, expense: 4200 },
];

const spendByCategory = [
  { category: 'Rent', amount: 1850 },
  { category: 'Groceries', amount: 420 },
  { category: 'Transport', amount: 240 },
  { category: 'Entertainment', amount: 130 },
  { category: 'Utilities', amount: 210 },
];

export function Overview() {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner
        title="Welcome back, Jane 👋"
        description="Here's how your money moved this month."
        action={{ label: 'View budgets', href: '/budgets' }}
      />
      <DashboardOverview
        title="This month"
        metrics={[
          { label: 'Total balance', value: '$24,500.00', icon: <WalletIcon />, color: 'info', description: 'Across 3 accounts' },
          { label: 'Income', value: '$5,800.00', icon: <TrendUpIcon />, color: 'success', description: '+11.5% from last month' },
          { label: 'Expenses', value: '$4,200.00', icon: <TrendDownIcon />, color: 'warning', description: '+7.7% from last month' },
          { label: 'Savings', value: '$1,600.00', icon: <PiggyBankIcon />, color: 'accent', description: '27.6% of income' },
        ]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Income vs expenses"
          description="Last 6 months"
          type="bar"
          data={monthlyIncomeExpense}
          categoryKey="month"
          series={[
            { key: 'income', label: 'Income', color: 'success' },
            { key: 'expense', label: 'Expense', color: 'warning' },
          ]}
        />
        <ChartCard
          title="Spend by category"
          description="This month"
          type="donut"
          data={spendByCategory}
          valueKey="amount"
          nameKey="category"
        />
      </div>
    </div>
  );
}
