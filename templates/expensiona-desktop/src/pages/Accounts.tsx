import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import { BalanceCard, PaymentMethodList } from '@nebula-lab/react-ui-blocks/dashboard';

const accounts = [
  { label: 'Checking', amount: '$14,200.00', description: 'Primary account · +2.1% this month' },
  { label: 'Savings', amount: '$10,300.00', description: 'Emergency fund · +0.8% this month' },
  { label: 'Credit card', amount: '-$620.40', description: 'Balance due Aug 12' },
];

const linkedCards = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '4444', expiry: '11/26' },
];

export function Accounts() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Heading as="h2" level={3}>
            Accounts
          </Heading>
          <Text className="mt-1 opacity-70">Every account and card feeding into your balance.</Text>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <BalanceCard key={account.label} {...account} />
        ))}
      </div>
      <PaymentMethodList
        methods={linkedCards}
        onSetDefault={() => {}}
        onRemove={() => {}}
        onAdd={() => {}}
      />
    </div>
  );
}
