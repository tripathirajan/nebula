import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ChartCard } from './chart-card';

// `recharts`' `ResponsiveContainer` measures its parent via `ResizeObserver`,
// which jsdom doesn't implement — without a stub it logs a harmless "width(0)
// height(0)" warning and renders a 0x0 SVG. This repo has no global
// ResizeObserver mock (nothing else needs one yet), so it's scoped to this
// file rather than added to vitest.setup.ts for every test.
beforeEach(() => {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

const monthlyData = [
  { month: 'Jan', us: 400, eu: 240 },
  { month: 'Feb', us: 300, eu: 139 },
];

const trafficData = [
  { source: 'Direct', visits: 4000 },
  { source: 'Referral', visits: 1500 },
];

describe('ChartCard (block)', () => {
  it('renders the title and description for a bar chart', () => {
    render(
      <ChartCard
        title="Revenue by region"
        description="Last 6 months"
        type="bar"
        data={monthlyData}
        categoryKey="month"
        series={[
          { key: 'us', label: 'US', color: 'primary' },
          { key: 'eu', label: 'EU', color: 'info' },
        ]}
      />,
    );
    expect(screen.getByText('Revenue by region')).toBeInTheDocument();
    expect(screen.getByText('Last 6 months')).toBeInTheDocument();
  });

  it('exposes an accessible chart region via role="img"', () => {
    render(
      <ChartCard
        title="Revenue by region"
        type="bar"
        data={monthlyData}
        categoryKey="month"
        series={[{ key: 'us', label: 'US', color: 'primary' }]}
      />,
    );
    expect(screen.getByRole('img', { name: /Revenue by region/ })).toBeInTheDocument();
  });

  it('renders a donut chart with a centered total', () => {
    render(<ChartCard title="Traffic by source" type="donut" data={trafficData} valueKey="visits" nameKey="source" />);
    expect(screen.getByText('Traffic by source')).toBeInTheDocument();
    expect(screen.getByText('5,500')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('has no axe violations (bar)', async () => {
    const { container } = render(
      <ChartCard
        title="Revenue by region"
        type="bar"
        data={monthlyData}
        categoryKey="month"
        series={[{ key: 'us', label: 'US', color: 'primary' }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (donut)', async () => {
    const { container } = render(
      <ChartCard title="Traffic by source" type="donut" data={trafficData} valueKey="visits" nameKey="source" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
