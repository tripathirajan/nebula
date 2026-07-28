import { Badge } from '@nebula-lab/react-ui/badge';
import { Button } from '@nebula-lab/react-ui/button';
import { Heading } from '@nebula-lab/react-ui/heading';
import { MenuItem } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';
import { CardListItem, DataTableBlock } from '@nebula-lab/react-ui-blocks';
import { useState } from 'react';

import { ImportTransactionsDialog } from '../components/ImportTransactionsDialog';
import { TransactionFormDialog } from '../components/TransactionFormDialog';
import { formatDate, formatSignedCurrency, useStore } from '../data/store';

import type { Transaction, TransactionType } from '../data/store';

const typeColor: Record<TransactionType, 'success' | 'warning' | 'neutral'> = {
  income: 'success',
  expense: 'warning',
  transfer: 'neutral',
};

const typeLabel: Record<TransactionType, string> = {
  income: 'Income',
  expense: 'Expense',
  transfer: 'Transfer',
};

function amountClassName(type: TransactionType) {
  if (type === 'income') return 'text-sm font-semibold text-[var(--color-success-text)]';
  if (type === 'transfer') return 'text-sm font-semibold opacity-70';
  return 'text-sm font-semibold';
}

export function Transactions() {
  const { transactions, accounts, categories, deleteTransaction } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>(undefined);

  function accountLabel(transaction: Transaction) {
    const from = accounts.find((a) => a.id === transaction.accountId)?.name ?? 'Unknown';
    if (transaction.type !== 'transfer') return from;
    const to = accounts.find((a) => a.id === transaction.toAccountId)?.name ?? 'Unknown';
    return `${from} → ${to}`;
  }

  function categoryLabel(transaction: Transaction) {
    const category = categories.find((c) => c.id === transaction.categoryId);
    if (!category) return '';
    const subcategory = category.subcategories.find((s) => s.id === transaction.subcategoryId);
    return subcategory ? `${category.name} · ${subcategory.name}` : category.name;
  }

  const filtered = transactions
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
        <div className="flex gap-2">
          <Button
            color="secondary"
            onClick={() => {
              setImportOpen(true);
            }}
          >
            Import
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            Add transaction
          </Button>
        </div>
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
                <Text className="text-xs opacity-70">{categoryLabel(transaction)}</Text>
              </div>
            ),
          },
          { key: 'account', header: 'Account', render: (transaction) => accountLabel(transaction) },
          { key: 'date', header: 'Date', render: (transaction) => formatDate(transaction.date) },
          {
            key: 'type',
            header: 'Type',
            render: (transaction) => <Badge color={typeColor[transaction.type]}>{typeLabel[transaction.type]}</Badge>,
          },
          {
            key: 'amount',
            header: 'Amount',
            sortable: true,
            render: (transaction) => (
              <Text className={amountClassName(transaction.type)}>
                {formatSignedCurrency(transaction.type === 'income' ? transaction.amount : -transaction.amount)}
              </Text>
            ),
          },
        ]}
        rows={filtered}
        getRowId={(transaction) => transaction.id}
        tabs={[
          { value: 'all', label: 'All', count: transactions.length },
          { value: 'income', label: 'Income', count: transactions.filter((t) => t.type === 'income').length },
          { value: 'expense', label: 'Expense', count: transactions.filter((t) => t.type === 'expense').length },
          { value: 'transfer', label: 'Transfer', count: transactions.filter((t) => t.type === 'transfer').length },
        ]}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        searchPlaceholder="Search transactions…"
        searchValue={search}
        onSearchChange={setSearch}
        rowActions={(transaction) => (
          <>
            <MenuItem
              onSelect={() => {
                setEditing(transaction);
                setFormOpen(true);
              }}
            >
              Edit
            </MenuItem>
            <MenuItem onSelect={() => deleteTransaction(transaction.id)}>Delete</MenuItem>
          </>
        )}
        rowActionsLabel={(transaction) => `Actions for ${transaction.description}`}
        renderCard={(transaction) => (
          <CardListItem
            title={transaction.description}
            description={`${accountLabel(transaction)} · ${formatDate(transaction.date)}`}
            trailing={
              <div className="flex flex-col items-end gap-1">
                <span className={amountClassName(transaction.type)}>
                  {formatSignedCurrency(transaction.type === 'income' ? transaction.amount : -transaction.amount)}
                </span>
                <Badge color={typeColor[transaction.type]}>{typeLabel[transaction.type]}</Badge>
              </div>
            }
            actions={
              <>
                <MenuItem
                  onSelect={() => {
                    setEditing(transaction);
                    setFormOpen(true);
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem onSelect={() => deleteTransaction(transaction.id)}>Delete</MenuItem>
              </>
            }
          />
        )}
        page={1}
        totalCount={filtered.length}
      />
      <TransactionFormDialog open={formOpen} onOpenChange={setFormOpen} transaction={editing} />
      <ImportTransactionsDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
