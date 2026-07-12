import { ChartCard } from '../dashboard/charts/chart-card';
import { DashboardOverview } from '../dashboard/widgets/dashboard-overview';
import { RankedList } from '../dashboard/widgets/ranked-list';
import { ThumbnailList } from '../dashboard/widgets/thumbnail-list';

import type { Meta, StoryObj } from '@storybook/react';

// Assembled-page story — see saas-dashboard-home.stories.tsx's header
// comment for the "Assembled Page" pattern this follows (BLOCKS_ARCHITECTURE.md
// §9). No component of its own; every piece here already ships independently.
const meta = {
  title: 'Blocks/Compositions/Analytics Overview',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sessionsData = [
  { day: 'Mon', sessions: 2400 },
  { day: 'Tue', sessions: 1398 },
  { day: 'Wed', sessions: 3200 },
  { day: 'Thu', sessions: 2780 },
  { day: 'Fri', sessions: 4100 },
  { day: 'Sat', sessions: 3490 },
  { day: 'Sun', sessions: 2100 },
];

const engagementData = [
  { channel: 'Direct', reach: 90, engagement: 60 },
  { channel: 'Social', reach: 70, engagement: 85 },
  { channel: 'Email', reach: 55, engagement: 40 },
  { channel: 'Referral', reach: 65, engagement: 50 },
  { channel: 'Organic', reach: 95, engagement: 75 },
];

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a4 4 0 118 0v2" />
    </svg>
  );
}

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--color-base-200)] p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <DashboardOverview
          title="Analytics overview"
          metrics={[
            {
              label: 'Total visits',
              value: '18.4k',
              icon: <BagIcon />,
              trend: { direction: 'up', value: '+11.2%', description: 'vs last week' },
              sparkline: [2400, 1398, 3200, 2780, 4100, 3490, 2100],
            },
            {
              label: 'Avg. session',
              value: '3m 42s',
              trend: { direction: 'up', value: '+8%', description: 'vs last week' },
            },
            {
              label: 'Bounce rate',
              value: '32.1%',
              trend: { direction: 'down', value: '-2.4%', description: 'vs last week' },
            },
            { label: 'Goal completions', value: '482' },
          ]}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Sessions this week"
            type="area"
            data={sessionsData}
            categoryKey="day"
            series={[{ key: 'sessions', label: 'Sessions', color: 'primary' }]}
          />
          <ChartCard
            title="Reach vs. engagement"
            description="By channel"
            type="radar"
            data={engagementData}
            categoryKey="channel"
            series={[
              { key: 'reach', label: 'Reach', color: 'primary' },
              { key: 'engagement', label: 'Engagement', color: 'info' },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RankedList
            title="Top pages"
            items={[
              { id: '1', label: '/pricing', value: '4.2k views' },
              { id: '2', label: '/blog/design-systems', value: '3.1k views' },
              { id: '3', label: '/docs/getting-started', value: '2.4k views' },
            ]}
          />
          <ThumbnailList
            title="Top referrers"
            items={[
              {
                id: '1',
                thumbnail: <span className="block h-10 w-10 rounded-[var(--radius-box)] bg-[var(--color-primary)]" />,
                label: 'google.com',
                description: 'Search',
                trend: { direction: 'up', value: '+18%' },
              },
              {
                id: '2',
                thumbnail: <span className="block h-10 w-10 rounded-[var(--radius-box)] bg-[var(--color-info)]" />,
                label: 'twitter.com',
                description: 'Social',
                trend: { direction: 'down', value: '-5%' },
              },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
