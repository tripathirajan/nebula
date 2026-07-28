import { Badge } from '@nebula-lab/react-ui/badge';
import { Calendar as CalendarGrid } from '@nebula-lab/react-ui/calendar';
import { Card } from '@nebula-lab/react-ui/card';
import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

import { formatDate, formatSignedCurrency, parseIsoDate, useStore } from '../data/store';

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const typeColor = { income: 'success', expense: 'warning', transfer: 'neutral' } as const;

export function Calendar() {
  const { transactions, categories } = useStore();
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());

  const selectedIso = selected ? toIso(selected) : undefined;
  const dayTransactions = transactions.filter((t) => t.date === selectedIso);

  const visibleMonth = selected ?? new Date();
  const monthTransactions = transactions.filter((t) => {
    const date = parseIsoDate(t.date);
    return date.getMonth() === visibleMonth.getMonth() && date.getFullYear() === visibleMonth.getFullYear();
  });
  const monthTotal = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading as="h2" level={3}>
          Calendar
        </Heading>
        <Text className="mt-1 opacity-70">
          {monthTransactions.length} transactions this month · {formatSignedCurrency(-monthTotal)} spent
        </Text>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
        <Card className="p-4">
          <CalendarGrid mode="single" selected={selected} onSelect={setSelected} />
        </Card>
        <Card className="flex flex-col gap-3 p-4">
          <Text className="font-medium">{selected ? formatDate(toIso(selected)) : 'No date selected'}</Text>
          {dayTransactions.length === 0 ? (
            <Text className="text-sm opacity-70">No transactions on this day.</Text>
          ) : (
            dayTransactions.map((transaction) => {
              const category = categories.find((c) => c.id === transaction.categoryId);
              return (
                <div key={transaction.id} className="flex items-center justify-between gap-4 border-b border-[var(--color-base-300)] pb-2 last:border-0 last:pb-0">
                  <div>
                    <Text className="text-sm font-medium">{transaction.description}</Text>
                    <Text className="text-xs opacity-70">{category?.name ?? 'Uncategorized'}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={typeColor[transaction.type]}>{transaction.type}</Badge>
                    <Text className="text-sm font-semibold">
                      {formatSignedCurrency(transaction.type === 'income' ? transaction.amount : -transaction.amount)}
                    </Text>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}
