import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { PaymentMethodList } from './payment-method-list';

const methods = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '8210', expiry: '11/26' },
];

describe('PaymentMethodList (block)', () => {
  it('renders one row per method with a Default badge only for the default one', () => {
    render(<PaymentMethodList methods={methods} />);
    expect(screen.getByText('Visa •••• 4242')).toBeInTheDocument();
    expect(screen.getByText('Mastercard •••• 8210')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('omits row-action menus when both onSetDefault and onRemove are omitted', () => {
    render(<PaymentMethodList methods={methods} />);
    expect(screen.queryByRole('button', { name: /Actions for/ })).not.toBeInTheDocument();
  });

  it('omits the "Add payment method" button when onAdd is omitted', () => {
    render(<PaymentMethodList methods={methods} />);
    expect(screen.queryByRole('button', { name: /Add payment method/ })).not.toBeInTheDocument();
  });

  it('renders the "Add payment method" button and calls onAdd', () => {
    const onAdd = vi.fn();
    render(<PaymentMethodList methods={methods} onAdd={onAdd} />);
    fireEvent.click(screen.getByRole('button', { name: /Add payment method/ }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('omits "Set as default" for the method that is already default, calls onSetDefault for others', async () => {
    const onSetDefault = vi.fn();
    render(<PaymentMethodList methods={methods} onSetDefault={onSetDefault} />);

    fireEvent.click(screen.getByRole('button', { name: 'Actions for Visa ending in 4242' }));
    await waitFor(() => expect(screen.queryByRole('menu')).toBeInTheDocument());
    expect(screen.queryByRole('menuitem', { name: 'Set as default' })).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });

    fireEvent.click(screen.getByRole('button', { name: 'Actions for Mastercard ending in 8210' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Set as default' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('menuitem', { name: 'Set as default' }));
    expect(onSetDefault).toHaveBeenCalledWith('2');
  });

  it('calls onRemove with the method id', async () => {
    const onRemove = vi.fn();
    render(<PaymentMethodList methods={methods} onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button', { name: 'Actions for Visa ending in 4242' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Remove' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('menuitem', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledWith('1');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <PaymentMethodList methods={methods} onSetDefault={() => {}} onRemove={() => {}} onAdd={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
