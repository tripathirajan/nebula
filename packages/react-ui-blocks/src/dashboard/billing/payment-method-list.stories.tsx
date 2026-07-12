import { expect, userEvent, waitFor, within } from '@storybook/test';

import { PaymentMethodList } from './payment-method-list';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Billing/Payment Method List',
  component: PaymentMethodList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PaymentMethodList>;

export default meta;
type Story = StoryObj<typeof meta>;

const methods = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '8210', expiry: '11/26' },
];

export const Default: Story = {
  args: {
    methods,
    onSetDefault: () => {},
    onRemove: () => {},
    onAdd: () => {},
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <PaymentMethodList {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Visa/)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: /Actions for Mastercard/ }));
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Set as default' })).toBeInTheDocument());
  },
};

export const ReadOnly: Story = {
  name: 'Read-only (no row actions)',
  args: { methods },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <PaymentMethodList {...args} />
    </div>
  ),
};
