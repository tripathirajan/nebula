import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { DashboardOverview } from './dashboard-overview';

const metrics = [
  { label: 'Revenue', value: '$12,450', description: '+12% from last month' },
  { label: 'Active users', value: '1,204' },
];

describe('DashboardOverview (block)', () => {
  it('renders a card per metric with label and value', () => {
    render(<DashboardOverview metrics={metrics} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,450')).toBeInTheDocument();
    expect(screen.getByText('Active users')).toBeInTheDocument();
    expect(screen.getByText('1,204')).toBeInTheDocument();
  });

  it('renders a description only when provided', () => {
    render(<DashboardOverview metrics={metrics} />);
    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
  });

  it('does not render a heading when title is omitted', () => {
    render(<DashboardOverview metrics={metrics} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders the title as a heading when provided', () => {
    render(<DashboardOverview title="Overview" metrics={metrics} />);
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<DashboardOverview title="Overview" metrics={metrics} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
