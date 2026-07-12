import { ChartCard } from './chart-card';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Charts/Chart Card',
  component: ChartCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const monthlyData = [
  { month: 'Jan', us: 400, eu: 240 },
  { month: 'Feb', us: 300, eu: 139 },
  { month: 'Mar', us: 520, eu: 380 },
  { month: 'Apr', us: 278, eu: 190 },
  { month: 'May', us: 610, eu: 420 },
  { month: 'Jun', us: 490, eu: 310 },
];

export const Bar: Story = {
  name: 'Bar chart',
  args: {
    title: 'Revenue by region',
    description: 'Last 6 months',
    type: 'bar',
    data: monthlyData,
    categoryKey: 'month',
    series: [
      { key: 'us', label: 'US', color: 'primary' },
      { key: 'eu', label: 'EU', color: 'info' },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <ChartCard {...args} />
    </div>
  ),
};

const trafficData = [
  { source: 'Direct', visits: 4000 },
  { source: 'Referral', visits: 1500 },
  { source: 'Social', visits: 1200 },
  { source: 'Email', visits: 800 },
];

export const Donut: Story = {
  name: 'Donut chart',
  args: {
    title: 'Traffic by source',
    type: 'donut',
    data: trafficData,
    valueKey: 'visits',
    nameKey: 'source',
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <ChartCard {...args} />
    </div>
  ),
};
