import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import { BalanceCard, PaymentMethodList } from '@nebula-lab/react-ui-blocks/dashboard';
import { Link } from 'react-router-dom';

import { computeAccountBalance, formatCurrency, useStore } from '../data/store';

import type { AccountType } from '../data/store';

const accountTypeDescription: Record<AccountType, string> = {
  checking: 'Primary account',
  savings: 'Savings account',
  credit: 'Credit card',
  cash: 'Cash',
};

const linkedCards = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '4444', expiry: '11/26' },
];

export function Accounts() {
  const { accounts, transactions } = useStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Heading as="h2" level={3}>
            Accounts
          </Heading>
          <Text className="mt-1 opacity-70">Every account and card feeding into your balance. Click one for its history.</Text>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Link key={account.id} to={`/accounts/${account.id}`} className="block rounded-[var(--radius-card)] transition-transform hover:scale-[1.01]">
            <BalanceCard
              label={account.name}
              amount={formatCurrency(computeAccountBalance(account, transactions))}
              description={accountTypeDescription[account.type]}
            />
          </Link>
        ))}
      </div>
      <PaymentMethodList methods={linkedCards} onSetDefault={() => {}} onRemove={() => {}} onAdd={() => {}} />
    </div>
  );
}
