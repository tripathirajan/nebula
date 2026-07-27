import { Heading } from '@nebula-lab/react-ui/heading';
import { BillingSummaryCard, ChartCard } from '@nebula-lab/react-ui-blocks/dashboard';

const monthlySpend = [
  { month: 'Feb', spend: 1800 },
  { month: 'Mar', spend: 2100 },
  { month: 'Apr', spend: 1650 },
  { month: 'May', spend: 2400 },
  { month: 'Jun', spend: 1950 },
];

export function Budget() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Heading as="h2" level={4}>
        Budget
      </Heading>
      <ChartCard title="Monthly spend" type="bar" data={monthlySpend} categoryKey="month" series={[{ key: 'spend', label: 'Spend', color: 'primary' }]} />
      <BillingSummaryCard
        title="Spend by category"
        description="This month"
        items={[
          { label: 'Groceries', value: 420, max: 800, color: 'success' },
          { label: 'Rent', value: 1850, max: 1850, color: 'warning' },
          { label: 'Entertainment', value: 130, max: 400, color: 'info' },
        ]}
      />
    </div>
  );
}
