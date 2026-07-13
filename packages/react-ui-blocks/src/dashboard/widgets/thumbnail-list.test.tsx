import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ThumbnailList } from './thumbnail-list';

const items = [
  {
    id: '1',
    thumbnail: <span data-testid="thumb-1" />,
    label: 'Wireless earbuds',
    description: '320 sold',
    trend: { direction: 'up' as const, value: '+12%' },
  },
  {
    id: '2',
    thumbnail: <span data-testid="thumb-2" />,
    label: 'Smart watch',
    trend: { direction: 'down' as const, value: '-4%' },
  },
];

describe('ThumbnailList (block)', () => {
  it('renders the title, thumbnail, label, and description', () => {
    render(<ThumbnailList title="Best sellers" items={items} />);
    expect(screen.getByText('Best sellers')).toBeInTheDocument();
    expect(screen.getByTestId('thumb-1')).toBeInTheDocument();
    expect(screen.getByText('Wireless earbuds')).toBeInTheDocument();
    expect(screen.getByText('320 sold')).toBeInTheDocument();
  });

  it('renders the trend value for items that have one', () => {
    render(<ThumbnailList items={items} />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('-4%')).toBeInTheDocument();
  });

  it('omits the trend indicator when an item has none', () => {
    render(<ThumbnailList items={[{ id: '1', thumbnail: <span />, label: 'No trend' }]} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ThumbnailList title="Best sellers" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
