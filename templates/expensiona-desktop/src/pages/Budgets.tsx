import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import { BalanceCard, BillingSummaryCard } from '@nebula-lab/react-ui-blocks/dashboard';

export function Budgets() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading as="h2" level={3}>
          Budgets
        </Heading>
        <Text className="mt-1 opacity-70">Current cycle: Jul 1 – Jul 31, 2026.</Text>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BalanceCard
          label="Budgeted this cycle"
          amount="$3,000.00"
          description="$2,660.00 spent so far · $340.00 left"
          actions={[{ label: 'Edit cycle', onClick: () => {} }]}
        />
        <BillingSummaryCard
          title="Spend by category"
          description="Jul 1 – Jul 31, 2026"
          items={[
            { label: 'Rent', value: 1850, max: 1850, color: 'warning', formatValue: (v, m) => `$${v} of $${m}` },
            { label: 'Groceries', value: 420, max: 600, color: 'success', formatValue: (v, m) => `$${v} of $${m}` },
            { label: 'Transport', value: 240, max: 300, color: 'info', formatValue: (v, m) => `$${v} of $${m}` },
            { label: 'Entertainment', value: 130, max: 250, color: 'accent', formatValue: (v, m) => `$${v} of $${m}` },
          ]}
        />
      </div>
    </div>
  );
}
