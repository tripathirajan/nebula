import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { BalanceCard } from './balance-card';

describe('BalanceCard (block)', () => {
  it('renders the label, amount, and description', () => {
    render(<BalanceCard label="Total balance" amount="$24,500.00" description="+2.5% from last month" />);
    expect(screen.getByText('Total balance')).toBeInTheDocument();
    expect(screen.getByText('$24,500.00')).toBeInTheDocument();
    expect(screen.getByText('+2.5% from last month')).toBeInTheDocument();
  });

  it('renders no action buttons when actions is omitted', () => {
    render(<BalanceCard label="Total balance" amount="$24,500.00" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders one button per action and calls its onClick', () => {
    const onSend = vi.fn();
    render(
      <BalanceCard
        label="Total balance"
        amount="$24,500.00"
        actions={[
          { label: 'Send', onClick: onSend },
          { label: 'Top up', onClick: () => {} },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Top up' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('renders an href action as a link-styled button', () => {
    render(<BalanceCard label="Total balance" amount="$24,500.00" actions={[{ label: 'View statement', href: '/statement' }]} />);
    const link = screen.getByRole('link', { name: 'View statement' });
    expect(link).toHaveAttribute('href', '/statement');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <BalanceCard
        label="Total balance"
        amount="$24,500.00"
        description="+2.5% from last month"
        actions={[{ label: 'Send', onClick: () => {} }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
