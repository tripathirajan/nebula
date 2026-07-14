import { ChartCard } from '../dashboard/charts/chart-card';
import { DashboardOverview } from '../dashboard/widgets/dashboard-overview';
import { WelcomeBanner } from '../dashboard/widgets/welcome-banner';
import { SaasAppHeader } from '../navigation/headers/saas-app-header';

import type { Meta, StoryObj } from '@storybook/react';

const LogoMark = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <rect width="24" height="24" rx="6" fill="var(--color-primary)" />
    <path d="M7 15.5 12 7l5 8.5H7Z" fill="var(--color-primary-content)" />
  </svg>
);

const navLinks = [
  { label: 'Overview', href: '#overview', active: true },
  { label: 'Reports', href: '#reports' },
  { label: 'Settings', href: '#settings' },
];

// One distinct icon + semantic color per metric — `DashboardMetric.color`
// already exists precisely for this ("varying this per metric is what
// gives a stat-card row the colorful look Minimals' dashboard homes have,
// instead of every card reading the same brand color", per its own doc
// comment) but is inert without an `icon`, and this composition previously
// passed neither, so every card rendered as plain text with no color at
// all — the flagship demo most people check first looked like a wireframe.
function RevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}

function ConversionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function ChurnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// Assembled-page story — demonstrates how several existing blocks compose
// into a real dashboard home screen, per BLOCKS_ARCHITECTURE.md §9's
// "Assembled Page" pattern. Lives in its own `Blocks/Compositions/` group
// (not nested under any one category) and has no component of its own —
// every piece here (`SaasAppHeader`, `WelcomeBanner`, `DashboardOverview`,
// `ChartCard`) is already a real, independently-exported block; this file
// only shows one way to put them on a page together. The header uses
// `SaasAppHeader`'s `glass` variant (scroll past the welcome banner to see
// it pick up its frosted-blur surface) so this flagship composition — the
// first thing most people check — actually demonstrates that feature
// instead of it only living in its own isolated `Blocks/Navigation/Headers`
// story where it's easy to miss.
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
    <div className="min-h-screen bg-[var(--color-base-200)]">
      <SaasAppHeader
        glass
        logo={<LogoMark />}
        brand="Acme"
        navLinks={navLinks}
        user={{ name: 'Jane Cooper', role: 'Admin' }}
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <WelcomeBanner
          title="Welcome back, Jane 👋"
          description="Here's what's happening with your projects today."
          action={{ label: 'View reports', href: '#reports' }}
        />
        <DashboardOverview
          title="Overview"
          metrics={[
            { label: 'Revenue', value: '$24,780', icon: <RevenueIcon />, color: 'success', description: '+12% from last month' },
            { label: 'Active users', value: '3,204', icon: <UsersIcon />, color: 'info', description: '+4% from last month' },
            { label: 'Conversion rate', value: '4.6%', icon: <ConversionIcon />, color: 'accent', description: '+0.8% from last month' },
            { label: 'Churn', value: '1.2%', icon: <ChurnIcon />, color: 'warning', description: '-0.3% from last month' },
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
