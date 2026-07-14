import { DashboardOverview } from './dashboard-overview';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Widgets/Dashboard Overview',
  component: DashboardOverview,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DashboardOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

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

// One distinct icon + semantic `color` per metric — `color` is inert
// without an `icon` (see the prop's own doc comment), so this demo used to
// render four plain text-only cards with no color at all despite the block
// existing specifically to support a colorful stat-card row.
const sampleMetrics = [
  { label: 'Revenue', value: '$12,450', icon: <RevenueIcon />, color: 'success' as const, description: '+12% from last month' },
  { label: 'Active users', value: '1,204', icon: <UsersIcon />, color: 'info' as const, description: '+4% from last month' },
  { label: 'Conversion rate', value: '3.2%', icon: <ConversionIcon />, color: 'accent' as const, description: '-0.4% from last month' },
  { label: 'Churn', value: '1.1%', icon: <ChurnIcon />, color: 'warning' as const, description: '+0.2% from last month' },
];

export const Default: Story = {
  args: {
    metrics: sampleMetrics,
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Overview',
    metrics: sampleMetrics,
  },
};

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7h12l1 13H5L6 7Zm3 0V5a3 3 0 0 1 6 0v2"
      />
    </svg>
  );
}

export const WithIconTrendAndSparkline: Story = {
  name: 'With icon, trend, and sparkline',
  args: {
    title: 'Overview',
    metrics: [
      {
        label: 'Weekly sales',
        value: '714k',
        icon: <BagIcon />,
        trend: { value: '+2.6%', direction: 'up' },
      },
      {
        label: 'Product sold',
        value: '765',
        trend: { value: '+2.6%', direction: 'up', description: 'last week' },
        sparkline: [4, 8, 6, 9, 7, 12, 10, 14, 11, 16],
      },
      {
        label: 'Total balance',
        value: '18,765',
        trend: { value: '-0.1%', direction: 'down', description: 'last week' },
        sparkline: [16, 14, 15, 11, 12, 8, 9, 6, 7, 4],
      },
    ],
  },
};
