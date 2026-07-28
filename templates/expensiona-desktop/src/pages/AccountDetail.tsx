import { Badge } from '@nebula-lab/react-ui/badge';
import { Button } from '@nebula-lab/react-ui/button';
import { Heading } from '@nebula-lab/react-ui/heading';
import { MenuItem } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';
import { CardListItem, DataTableBlock } from '@nebula-lab/react-ui-blocks';
import { BalanceCard } from '@nebula-lab/react-ui-blocks/dashboard';
import * as React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { TransactionFormDialog } from '../components/TransactionFormDialog';
import { computeAccountBalance, formatCurrency, formatDate, formatSignedCurrency, useStore } from '../data/store';

import type { Transaction, TransactionType } from '../data/store';

const typeColor: Record<TransactionType, 'success' | 'warning' | 'neutral'> = {
  income: 'success',
  expense: 'warning',
  transfer: 'neutral',
};

export function AccountDetail() {
  const { id } = useParams<{ id: string }>();
  const { accounts, transactions, categories, deleteTransaction } = useStore();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Transaction | undefined>(undefined);

  const account = accounts.find((a) => a.id === id);
  if (!account) return <Navigate to="/accounts" replace />;

  const accountId = account.id;
  const accountTransactions = transactions.filter((t) => t.accountId === accountId || t.toAccountId === accountId);

  function categoryLabel(transaction: Transaction) {
    return categories.find((c) => c.id === transaction.categoryId)?.name ?? '';
  }

  function amountForAccount(transaction: Transaction) {
    if (transaction.type === 'transfer') {
      return transaction.toAccountId === accountId ? transaction.amount : -transaction.amount;
    }
    return transaction.type === 'income' ? transaction.amount : -transaction.amount;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/accounts" className="text-sm opacity-70 hover:underline">
            ← Accounts
          </Link>
          <Heading as="h2" level={3} className="mt-1">
            {account.name}
          </Heading>
        </div>
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

      <BalanceCard label="Current balance" amount={formatCurrency(computeAccountBalance(account, transactions))} />

      <DataTableBlock
        columns={[
          {
            key: 'description',
            header: 'Description',
            render: (transaction) => (
              <div>
                <Text className="text-sm font-medium">{transaction.description}</Text>
                <Text className="text-xs opacity-70">{categoryLabel(transaction)}</Text>
              </div>
            ),
          },
          { key: 'date', header: 'Date', render: (transaction) => formatDate(transaction.date) },
          {
            key: 'type',
            header: 'Type',
            render: (transaction) => <Badge color={typeColor[transaction.type]}>{transaction.type}</Badge>,
          },
          {
            key: 'amount',
            header: 'Amount',
            render: (transaction) => {
              const signed = amountForAccount(transaction);
              return (
                <Text className={signed >= 0 ? 'text-sm font-semibold text-[var(--color-success-text)]' : 'text-sm font-semibold'}>
                  {formatSignedCurrency(signed)}
                </Text>
              );
            },
          },
        ]}
        rows={accountTransactions}
        getRowId={(transaction) => transaction.id}
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
        renderCard={(transaction) => {
          const signed = amountForAccount(transaction);
          return (
            <CardListItem
              title={transaction.description}
              description={formatDate(transaction.date)}
              trailing={
                <span className={signed >= 0 ? 'font-semibold text-[var(--color-success-text)]' : 'font-semibold'}>
                  {formatSignedCurrency(signed)}
                </span>
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
          );
        }}
        page={1}
        totalCount={accountTransactions.length}
      />

      <TransactionFormDialog open={formOpen} onOpenChange={setFormOpen} transaction={editing} defaultAccountId={account.id} />
    </div>
  );
}
