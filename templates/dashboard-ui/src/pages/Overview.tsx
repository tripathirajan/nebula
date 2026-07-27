import { ChartCard, DashboardOverview, WelcomeBanner } from '@nebula-lab/react-ui-blocks/dashboard';

import { ChurnIcon, ConversionIcon, RevenueIcon, UsersIcon } from '../icons';

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

export function Overview() {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner
        title="Welcome back, Jane 👋"
        description="Here's what's happening with your projects today."
        action={{ label: 'View reports', href: '#' }}
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
  );
}
