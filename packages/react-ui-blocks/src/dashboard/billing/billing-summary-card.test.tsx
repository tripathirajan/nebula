import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { BillingSummaryCard } from './billing-summary-card';

const items = [
  { label: 'Documents', value: 8, max: 20, color: 'primary' as const },
  { label: 'Images', value: 5, max: 20, color: 'info' as const },
];

describe('BillingSummaryCard (block)', () => {
  it('renders the title, description, and one row per item', () => {
    render(<BillingSummaryCard title="Storage" description="20 GB plan" items={items} />);
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('20 GB plan')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
  });

  it('falls back to a plain "value / max" when formatValue is omitted', () => {
    render(<BillingSummaryCard title="Storage" items={items} />);
    expect(screen.getByText('8 / 20')).toBeInTheDocument();
    expect(screen.getByText('5 / 20')).toBeInTheDocument();
  });

  it('uses formatValue when provided', () => {
    render(
      <BillingSummaryCard
        title="Storage"
        items={[{ label: 'Documents', value: 8, max: 20, formatValue: (v, m) => `${v} GB of ${m} GB` }]}
      />,
    );
    expect(screen.getByText('8 GB of 20 GB')).toBeInTheDocument();
  });

  it('renders a progressbar per item with the correct value', () => {
    render(<BillingSummaryCard title="Storage" items={items} />);
    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(2);
    expect(bars[0]).toHaveAttribute('aria-valuenow', '8');
    expect(bars[0]).toHaveAttribute('aria-valuemax', '20');
  });

  it('has no axe violations', async () => {
    const { container } = render(<BillingSummaryCard title="Storage" description="20 GB plan" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
