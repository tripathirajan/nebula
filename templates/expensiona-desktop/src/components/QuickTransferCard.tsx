import { Avatar, AvatarFallback } from '@nebula-lab/react-ui/avatar';
import { Button } from '@nebula-lab/react-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula-lab/react-ui/card';
import { Input } from '@nebula-lab/react-ui/input';
import * as React from 'react';

import { useStore } from '../data/store';

/**
 * A one-tap "move money between my own accounts" panel — Minimals' Banking
 * dashboard home pairs a balance card with exactly this pattern (avatar
 * row + amount + CTA); here the "contacts" are the user's own accounts,
 * since expensiona has no payee/contact concept of its own.
 */
export function QuickTransferCard() {
  const { accounts, addTransaction } = useStore();
  const [fromId, setFromId] = React.useState(accounts[0]?.id);
  const [toId, setToId] = React.useState(accounts[1]?.id);
  const [amount, setAmount] = React.useState('');

  function handleTransfer() {
    const numericAmount = Number(amount);
    if (!fromId || !toId || fromId === toId || !numericAmount) return;
    addTransaction({
      description: 'Quick transfer',
      amount: numericAmount,
      type: 'transfer',
      date: new Date().toISOString().slice(0, 10),
      accountId: fromId,
      toAccountId: toId,
      categoryId: 'transfer',
    });
    setAmount('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick transfer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => setFromId(account.id)}
              className="flex shrink-0 flex-col items-center gap-1"
            >
              <Avatar
                className={
                  account.id === fromId
                    ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--card-bg)]'
                    : ''
                }
              >
                <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs opacity-70">{account.name}</span>
            </button>
          ))}
        </div>
        <Input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <select
          aria-label="Transfer to account"
          value={toId}
          onChange={(event) => setToId(event.target.value)}
          className="h-10 rounded-[var(--radius-selector)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-text)]"
        >
          {accounts
            .filter((account) => account.id !== fromId)
            .map((account) => (
              <option key={account.id} value={account.id}>
                To {account.name}
              </option>
            ))}
        </select>
        <Button color="primary" onClick={handleTransfer} disabled={!amount || fromId === toId}>
          Transfer
        </Button>
      </CardContent>
    </Card>
  );
}
