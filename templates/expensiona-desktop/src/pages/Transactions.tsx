import { Badge } from '@nebula-lab/react-ui/badge';
import { Button } from '@nebula-lab/react-ui/button';
import { Heading } from '@nebula-lab/react-ui/heading';
import { MenuItem } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';
import { CardListItem, DataTableBlock } from '@nebula-lab/react-ui-blocks';
import { useState } from 'react';

interface DemoTransaction {
  id: string;
  description: string;
  category: string;
  account: string;
  date: string;
  /** Pre-formatted with its own sign, e.g. `"+$4,200.00"`/`"-$86.40"` — same
   * no-currency-opinion convention `BalanceCard.amount` documents. */
  amount: string;
  type: 'income' | 'expense' | 'transfer';
}

const allTransactions: DemoTransaction[] = [
  { id: '1', description: 'Salary deposit', category: 'Salary', account: 'Checking', date: 'Jul 27, 2026', amount: '+$4,200.00', type: 'income' },
  { id: '2', description: 'Rent payment', category: 'Housing', account: 'Checking', date: 'Jul 26, 2026', amount: '-$1,850.00', type: 'expense' },
  { id: '3', description: 'Whole Foods', category: 'Groceries', account: 'Checking', date: 'Jul 25, 2026', amount: '-$86.40', type: 'expense' },
  { id: '4', description: 'To Savings', category: 'Transfer', account: 'Checking → Savings', date: 'Jul 24, 2026', amount: '-$500.00', type: 'transfer' },
  { id: '5', description: 'Freelance invoice', category: 'Side income', account: 'Checking', date: 'Jul 22, 2026', amount: '+$650.00', type: 'income' },
  { id: '6', description: 'Netflix', category: 'Entertainment', account: 'Credit card', date: 'Jul 20, 2026', amount: '-$15.49', type: 'expense' },
  { id: '7', description: 'Gas station', category: 'Transport', account: 'Credit card', date: 'Jul 19, 2026', amount: '-$54.20', type: 'expense' },
];

const typeColor: Record<DemoTransaction['type'], 'success' | 'warning' | 'neutral'> = {
  income: 'success',
  expense: 'warning',
  transfer: 'neutral',
};

const typeLabel: Record<DemoTransaction['type'], string> = {
  income: 'Income',
  expense: 'Expense',
  transfer: 'Transfer',
};

function amountClassName(type: DemoTransaction['type']) {
  if (type === 'income') return 'text-sm font-semibold text-[var(--color-success-text)]';
  if (type === 'transfer') return 'text-sm font-semibold opacity-70';
  return 'text-sm font-semibold';
}

export function Transactions() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = allTransactions
    .filter((transaction) => activeTab === 'all' || transaction.type === activeTab)
    .filter((transaction) => transaction.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Heading as="h2" level={3}>
            Transactions
          </Heading>
          <Text className="mt-1 opacity-70">Every income, expense, and transfer across your accounts.</Text>
        </div>
        <Button color="primary">Add transaction</Button>
      </div>
      <DataTableBlock
        columns={[
          {
            key: 'description',
            header: 'Description',
            sortable: true,
            render: (transaction) => (
              <div>
                <Text className="text-sm font-medium">{transaction.description}</Text>
                <Text className="text-xs opacity-70">{transaction.category}</Text>
              </div>
            ),
          },
          { key: 'account', header: 'Account', render: (transaction) => transaction.account },
          { key: 'date', header: 'Date', render: (transaction) => transaction.date },
          {
            key: 'type',
            header: 'Type',
            render: (transaction) => <Badge color={typeColor[transaction.type]}>{typeLabel[transaction.type]}</Badge>,
          },
          {
            key: 'amount',
            header: 'Amount',
            sortable: true,
            render: (transaction) => <Text className={amountClassName(transaction.type)}>{transaction.amount}</Text>,
          },
        ]}
        rows={filtered}
        getRowId={(transaction) => transaction.id}
        tabs={[
          { value: 'all', label: 'All', count: allTransactions.length },
          { value: 'income', label: 'Income', count: allTransactions.filter((t) => t.type === 'income').length },
          { value: 'expense', label: 'Expense', count: allTransactions.filter((t) => t.type === 'expense').length },
          { value: 'transfer', label: 'Transfer', count: allTransactions.filter((t) => t.type === 'transfer').length },
        ]}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        searchPlaceholder="Search transactions…"
        searchValue={search}
        onSearchChange={setSearch}
        rowActions={() => (
          <>
            <MenuItem onSelect={() => {}}>Edit</MenuItem>
            <MenuItem onSelect={() => {}}>Delete</MenuItem>
          </>
        )}
        rowActionsLabel={(transaction) => `Actions for ${transaction.description}`}
        renderCard={(transaction) => (
          <CardListItem
            title={transaction.description}
            description={`${transaction.account} · ${transaction.date}`}
            trailing={
              <div className="flex flex-col items-end gap-1">
                <span className={amountClassName(transaction.type)}>{transaction.amount}</span>
                <Badge color={typeColor[transaction.type]}>{typeLabel[transaction.type]}</Badge>
              </div>
            }
            actions={
              <>
                <MenuItem onSelect={() => {}}>Edit</MenuItem>
                <MenuItem onSelect={() => {}}>Delete</MenuItem>
              </>
            }
          />
        )}
        page={1}
        totalCount={filtered.length}
      />
    </div>
  );
}
