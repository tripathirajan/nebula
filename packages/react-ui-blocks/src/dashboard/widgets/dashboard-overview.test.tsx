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

  it('renders a trend value and description in place of a plain description', () => {
    render(
      <DashboardOverview
        metrics={[
          {
            label: 'Product sold',
            value: '765',
            description: 'ignored because trend is set',
            trend: { value: '+2.6%', direction: 'up', description: 'last week' },
          },
        ]}
      />,
    );
    expect(screen.getByText('+2.6%')).toBeInTheDocument();
    expect(screen.getByText('last week')).toBeInTheDocument();
    expect(screen.queryByText('ignored because trend is set')).not.toBeInTheDocument();
  });

  it('renders an icon badge only when provided', () => {
    render(
      <DashboardOverview
        metrics={[{ label: 'Revenue', value: '$12,450', icon: <svg data-testid="metric-icon" /> }]}
      />,
    );
    expect(screen.getByTestId('metric-icon')).toBeInTheDocument();
  });

  it("tints the icon badge with the metric's color, defaulting to primary", () => {
    render(
      <DashboardOverview
        metrics={[
          { label: 'Revenue', value: '$1', icon: <svg data-testid="icon-default" /> },
          { label: 'Bookings', value: '$2', icon: <svg data-testid="icon-warning" />, color: 'warning' },
        ]}
      />,
    );
    const defaultBadge = screen.getByTestId('icon-default').parentElement;
    const warningBadge = screen.getByTestId('icon-warning').parentElement;
    expect(defaultBadge).toHaveStyle({ color: 'var(--color-primary)' });
    expect(warningBadge).toHaveStyle({ color: 'var(--color-warning)' });
  });

  it('truncates a long trend description instead of wrapping it', () => {
    render(
      <DashboardOverview
        metrics={[
          {
            label: 'Total visits',
            value: '18.4k',
            trend: { value: '+11.2%', direction: 'up', description: 'vs last week' },
          },
        ]}
      />,
    );
    const description = screen.getByText('vs last week');
    expect(description).toHaveClass('truncate');
    expect(description).not.toHaveClass('whitespace-normal');
  });

  it('renders a sparkline only when provided', () => {
    const { container } = render(
      <DashboardOverview metrics={[{ label: 'Revenue', value: '$12,450', sparkline: [1, 2, 3] }]}
      />,
    );
    expect(container.querySelector('svg polyline')).toBeInTheDocument();
  });

  it('has no axe violations with icon, trend, and sparkline all present', async () => {
    const { container } = render(
      <DashboardOverview
        metrics={[
          {
            label: 'Product sold',
            value: '765',
            icon: <svg />,
            trend: { value: '+2.6%', direction: 'up', description: 'last week' },
            sparkline: [4, 8, 6, 9],
          },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
