import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { TransactionForm } from './transaction-form';

const categories = ['Groceries', 'Rent'];

describe('TransactionForm (block)', () => {
  it('renders default title and fields', () => {
    render(<TransactionForm categories={categories} />);
    expect(screen.getByText('Add transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expense' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Income' })).toBeInTheDocument();
  });

  it('defaults the type toggle to Expense', () => {
    render(<TransactionForm categories={categories} />);
    expect(screen.getByRole('button', { name: 'Expense' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onSubmit with parsed field values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TransactionForm categories={categories} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Description'), 'Weekly groceries');
    await user.type(screen.getByLabelText('Amount'), '42.5');
    await user.click(screen.getByRole('button', { name: 'Save transaction' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Weekly groceries',
        amount: 42.5,
        type: 'expense',
      }),
    );
  });

  it('shows the top-level error message with role="alert"', () => {
    render(<TransactionForm categories={categories} error="Something went wrong" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('disables the submit button while isSubmitting', () => {
    render(<TransactionForm categories={categories} isSubmitting />);
    expect(screen.getByRole('button', { name: 'Save transaction' })).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<TransactionForm categories={categories} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
