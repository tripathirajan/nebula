import { Heading } from '@nebula-lab/react-ui/heading';
import { PaymentMethodList } from '@nebula-lab/react-ui-blocks/dashboard';

const methods = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '4444', expiry: '11/26' },
];

export function Cards() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Heading as="h2" level={4}>
        Cards
      </Heading>
      <PaymentMethodList methods={methods} onSetDefault={() => {}} onRemove={() => {}} onAdd={() => {}} />
    </div>
  );
}
