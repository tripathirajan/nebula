import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import {
  BalanceCard,
  BillingSummaryCard,
  PaymentMethodList,
  PlanCards,
} from '@nebula-lab/react-ui-blocks/dashboard';
import { useState } from 'react';

const plans = [
  { value: 'starter', name: 'Starter', price: '$0', period: '/month', description: 'For side projects', features: ['1 project', 'Community support'] },
  { value: 'pro', name: 'Pro', price: '$29', period: '/month', description: 'For growing teams', features: ['Unlimited projects', 'Priority support', 'Custom domains'], badge: 'Most popular' },
  { value: 'enterprise', name: 'Enterprise', price: '$99', period: '/month', description: 'For large orgs', features: ['SSO', 'Dedicated support', 'Uptime SLA'] },
];

const methods = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '4444', expiry: '11/26' },
];

export function Billing() {
  const [plan, setPlan] = useState('pro');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading as="h2" level={3}>
          Billing
        </Heading>
        <Text className="mt-1 opacity-70">Manage your plan, usage, and payment methods.</Text>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BalanceCard
          label="Current balance"
          amount="$1,240.00"
          description="Next invoice on Aug 1"
          actions={[{ label: 'Download invoice', onClick: () => {} }]}
        />
        <BillingSummaryCard
          title="Usage"
          description="Pro plan"
          items={[
            { label: 'Storage', value: 8, max: 20, color: 'primary', formatValue: (v, m) => `${v} GB of ${m} GB` },
            { label: 'Seats', value: 6, max: 10, color: 'info', formatValue: (v, m) => `${v} of ${m} seats` },
            { label: 'API calls', value: 42000, max: 100000, color: 'warning' },
          ]}
        />
      </div>
      <PlanCards plans={plans} value={plan} onValueChange={setPlan} aria-label="Choose a plan" />
      <PaymentMethodList methods={methods} onSetDefault={() => {}} onRemove={() => {}} onAdd={() => {}} />
    </div>
  );
}
