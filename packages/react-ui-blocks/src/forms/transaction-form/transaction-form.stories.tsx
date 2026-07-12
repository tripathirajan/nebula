import { TransactionForm } from './transaction-form';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Forms/Transaction Form',
  component: TransactionForm,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    categories: ['Groceries', 'Rent', 'Utilities', 'Salary'],
    onSubmit: (values) => console.log(values),
  },
};

export const WithError: Story = {
  args: {
    categories: ['Groceries', 'Rent', 'Utilities', 'Salary'],
    error: 'Could not save the transaction. Please try again.',
    onSubmit: (values) => console.log(values),
  },
};
