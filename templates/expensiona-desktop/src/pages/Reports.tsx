import { Badge } from '@nebula-lab/react-ui/badge';
import { Card } from '@nebula-lab/react-ui/card';
import { DateRangePicker } from '@nebula-lab/react-ui/date-range-picker';
import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import { ChartCard, DashboardOverview } from '@nebula-lab/react-ui-blocks/dashboard';
import * as React from 'react';

import { formatCurrency, formatDate, parseIsoDate, useStore } from '../data/store';
import { PiggyBankIcon, TrendDownIcon, TrendUpIcon } from '../icons';

import type { Transaction } from '../data/store';

function startOfMonthAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function Reports() {
  const { transactions, categories } = useStore();
  const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({ from: startOfMonthAgo(30), to: new Date() });
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | undefined>(undefined);

  const inRange = (transaction: Transaction) => {
    const date = parseIsoDate(transaction.date);
    if (range.from && date < range.from) return false;
    if (range.to && date > range.to) return false;
    return true;
  };

  const rangeTransactions = transactions.filter(inRange);
  const income = rangeTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = rangeTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const spendByCategory = categories
    .map((category) => ({
      id: category.id,
      category: category.name,
      amount: rangeTransactions
        .filter((t) => t.type === 'expense' && t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((entry) => entry.amount > 0);

  const spendByDayMap = new Map<string, number>();
  for (const transaction of rangeTransactions) {
    if (transaction.type !== 'expense') continue;
    spendByDayMap.set(transaction.date, (spendByDayMap.get(transaction.date) ?? 0) + transaction.amount);
  }
  const spendByDay = [...spendByDayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date: formatDate(date), amount }));

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedCategoryTransactions = selectedCategoryId
    ? rangeTransactions.filter((t) => t.type === 'expense' && t.categoryId === selectedCategoryId)
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Heading as="h2" level={3}>
            Reports
          </Heading>
          <Text className="mt-1 opacity-70">Analyze income and spending over any date range.</Text>
        </div>
        <DateRangePicker value={range} onValueChange={setRange} />
      </div>

      <DashboardOverview
        title="Selected range"
        metrics={[
          { label: 'Income', value: formatCurrency(income), icon: <TrendUpIcon />, color: 'success' },
          { label: 'Expenses', value: formatCurrency(expense), icon: <TrendDownIcon />, color: 'warning' },
          { label: 'Net', value: formatCurrency(income - expense), icon: <PiggyBankIcon />, color: 'accent' },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Spend by day" type="bar" data={spendByDay} categoryKey="date" series={[{ key: 'amount', label: 'Spend', color: 'warning' }]} />
        <Card className="flex flex-col gap-2 p-4">
          <Text className="text-base font-semibold">Spend by category</Text>
          <Text className="text-sm opacity-70">Click a category to see its transactions.</Text>
          <div className="mt-2 flex flex-col gap-2">
            {spendByCategory.length === 0 ? (
              <Text className="text-sm opacity-70">No expenses in this range.</Text>
            ) : (
              spendByCategory.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(entry.id === selectedCategoryId ? undefined : entry.id)}
                  className="flex items-center justify-between rounded-[var(--radius-selector)] px-3 py-2 text-left transition-colors hover:bg-[var(--color-base-200)] data-[selected=true]:bg-[var(--color-base-200)]"
                  data-selected={entry.id === selectedCategoryId}
                >
                  <Text className="text-sm font-medium">{entry.category}</Text>
                  <Text className="text-sm font-semibold">{formatCurrency(entry.amount)}</Text>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      {selectedCategory ? (
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <Text className="font-medium">{selectedCategory.name} transactions</Text>
            <Badge color={selectedCategory.color}>{selectedCategoryTransactions.length}</Badge>
          </div>
          {selectedCategoryTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between border-b border-[var(--color-base-300)] pb-2 last:border-0 last:pb-0">
              <div>
                <Text className="text-sm font-medium">{transaction.description}</Text>
                <Text className="text-xs opacity-70">{formatDate(transaction.date)}</Text>
              </div>
              <Text className="text-sm font-semibold">{formatCurrency(transaction.amount)}</Text>
            </div>
          ))}
        </Card>
      ) : null}
    </div>
  );
}
