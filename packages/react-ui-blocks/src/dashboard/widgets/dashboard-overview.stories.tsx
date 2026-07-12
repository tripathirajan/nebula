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
