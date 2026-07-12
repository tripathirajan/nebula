import { ChartCard } from '../dashboard/charts/chart-card';
import { DashboardOverview } from '../dashboard/widgets/dashboard-overview';
import { WelcomeBanner } from '../dashboard/widgets/welcome-banner';

import type { Meta, StoryObj } from '@storybook/react';

// Assembled-page story — demonstrates how several existing blocks compose
// into a real dashboard home screen, per BLOCKS_ARCHITECTURE.md §9's
// "Assembled Page" pattern. Lives in its own `Blocks/Compositions/` group
// (not nested under any one category) and has no component of its own —
// every piece here (`WelcomeBanner`, `DashboardOverview`, `ChartCard`) is
// already a real, independently-exported block; this file only shows one
// way to put them on a page together.
const meta = {
  title: 'Blocks/Compositions/SaaS Dashboard Home',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const monthlyRevenue = [
  { month: 'Jan', us: 4000, eu: 2400 },
  { month: 'Feb', us: 3000, eu: 1398 },
  { month: 'Mar', us: 5200, eu: 3800 },
  { month: 'Apr', us: 2780, eu: 1908 },
  { month: 'May', us: 6100, eu: 4200 },
  { month: 'Jun', us: 4900, eu: 3100 },
];

const trafficBySource = [
  { source: 'Direct', visits: 4200 },
  { source: 'Referral', visits: 1800 },
  { source: 'Social', visits: 1300 },
  { source: 'Email', visits: 900 },
];

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--color-base-200)] p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <WelcomeBanner
          title="Welcome back, Jane 👋"
          description="Here's what's happening with your projects today."
          action={{ label: 'View reports', href: '#reports' }}
        />
        <DashboardOverview
          title="Overview"
          metrics={[
            { label: 'Revenue', value: '$24,780', description: '+12% from last month' },
            { label: 'Active users', value: '3,204', description: '+4% from last month' },
            { label: 'Conversion rate', value: '4.6%', description: '+0.8% from last month' },
            { label: 'Churn', value: '1.2%', description: '-0.3% from last month' },
          ]}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Revenue by region"
            description="Last 6 months"
            type="bar"
            data={monthlyRevenue}
            categoryKey="month"
            series={[
              { key: 'us', label: 'US', color: 'primary' },
              { key: 'eu', label: 'EU', color: 'info' },
            ]}
          />
          <ChartCard
            title="Traffic by source"
            type="donut"
            data={trafficBySource}
            valueKey="visits"
            nameKey="source"
          />
        </div>
      </div>
    </div>
  ),
};
