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

const sampleMetrics = [
  { label: 'Revenue', value: '$12,450', description: '+12% from last month' },
  { label: 'Active users', value: '1,204', description: '+4% from last month' },
  { label: 'Conversion rate', value: '3.2%', description: '-0.4% from last month' },
  { label: 'Churn', value: '1.1%', description: '+0.2% from last month' },
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
