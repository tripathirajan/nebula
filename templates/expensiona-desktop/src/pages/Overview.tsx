import { ChartCard, DashboardOverview, WelcomeBanner } from '@nebula-lab/react-ui-blocks/dashboard';

import { computeAccountBalance, formatCurrency, useStore } from '../data/store';
import { PiggyBankIcon, TrendDownIcon, TrendUpIcon, WalletIcon } from '../icons';

// Illustrative — the seed data only covers the current cycle, so a real
// 6-month trend isn't derivable from it. A real app would compute this the
// same way `spendByCategory` below is computed, once more than one month of
// transaction history exists.
const monthlyIncomeExpense = [
  { month: 'Feb', income: 5200, expense: 4100 },
  { month: 'Mar', income: 5400, expense: 3600 },
  { month: 'Apr', income: 5200, expense: 4400 },
  { month: 'May', income: 6100, expense: 3900 },
  { month: 'Jun', income: 5800, expense: 4200 },
];

export function Overview() {
  const { accounts, transactions, categories } = useStore();

  const totalBalance = accounts.reduce((sum, account) => sum + computeAccountBalance(account, transactions), 0);
  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const spendByCategory = categories
    .map((category) => ({
      category: category.name,
      amount: transactions
        .filter((t) => t.type === 'expense' && t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((entry) => entry.amount > 0);

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
          { label: 'Total balance', value: formatCurrency(totalBalance), icon: <WalletIcon />, color: 'info', description: `Across ${accounts.length} accounts` },
          { label: 'Income', value: formatCurrency(income), icon: <TrendUpIcon />, color: 'success', description: 'This cycle' },
          { label: 'Expenses', value: formatCurrency(expenses), icon: <TrendDownIcon />, color: 'warning', description: 'This cycle' },
          { label: 'Savings', value: formatCurrency(savings), icon: <PiggyBankIcon />, color: 'accent', description: `${savingsRate}% of income` },
        ]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Income vs expenses"
          description="Illustrative — last 5 months"
          type="bar"
          data={monthlyIncomeExpense}
          categoryKey="month"
          series={[
            { key: 'income', label: 'Income', color: 'success' },
            { key: 'expense', label: 'Expense', color: 'warning' },
          ]}
        />
        <ChartCard title="Spend by category" description="This cycle" type="donut" data={spendByCategory} valueKey="amount" nameKey="category" />
      </div>
    </div>
  );
}
