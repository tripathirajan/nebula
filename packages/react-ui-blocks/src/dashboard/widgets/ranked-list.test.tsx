import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { RankedList } from './ranked-list';

const items = [
  { id: '1', label: 'Wireless earbuds', value: '$12,450' },
  { id: '2', label: 'Smart watch', value: '$9,800' },
];

describe('RankedList (block)', () => {
  it('renders the title and one row per item', () => {
    render(<RankedList title="Top products" items={items} />);
    expect(screen.getByText('Top products')).toBeInTheDocument();
    expect(screen.getByText('Wireless earbuds')).toBeInTheDocument();
    expect(screen.getByText('$12,450')).toBeInTheDocument();
  });

  it('auto-computes rank from index when rank is omitted', () => {
    render(<RankedList items={items} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('uses an explicit rank when given', () => {
    render(<RankedList items={[{ id: '1', rank: 8, label: 'United States', value: '$42,100' }]} />);
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('omits the header when title is not given', () => {
    render(<RankedList items={items} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<RankedList title="Top products" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
