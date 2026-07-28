import { Button } from '@nebula-lab/react-ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '@nebula-lab/react-ui/dialog';
import { Field, FieldLabel } from '@nebula-lab/react-ui/field';
import { Heading } from '@nebula-lab/react-ui/heading';
import { Select, SelectContent, SelectItem, SelectPortal, SelectTrigger, SelectValue } from '@nebula-lab/react-ui/select';
import { Text } from '@nebula-lab/react-ui/text';
import { BalanceCard, BillingSummaryCard } from '@nebula-lab/react-ui-blocks/dashboard';
import * as React from 'react';

import { formatCurrency, formatCycleRange, getCycleRange, parseIsoDate, useStore } from '../data/store';

const cycleDays = Array.from({ length: 28 }, (_, i) => i + 1);

function CycleEditorDialog(props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { open, onOpenChange } = props;
  const { cycle, setCycle } = useStore();
  const [startDay, setStartDay] = React.useState(String(cycle.startDay));

  React.useEffect(() => {
    if (open) setStartDay(String(cycle.startDay));
  }, [open, cycle.startDay]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="w-full max-w-sm">
          <DialogTitle>Edit budget cycle</DialogTitle>
          <Text className="mt-1 text-sm opacity-70">Your cycle doesn&apos;t have to start on the 1st of the month.</Text>
          <Field className="mt-4">
            <FieldLabel>Cycle starts on day</FieldLabel>
            <Select value={startDay} onValueChange={setStartDay}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  {cycleDays.map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Field>
          <div className="mt-4 flex justify-end gap-2">
            <Button color="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setCycle({ startDay: Number(startDay) });
                onOpenChange(false);
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export function Budgets() {
  const { categories, transactions, budgets, cycle } = useStore();
  const [cycleEditorOpen, setCycleEditorOpen] = React.useState(false);

  const today = new Date();
  const { start, end } = getCycleRange(cycle, today);
  const cycleTransactions = transactions.filter((t) => {
    const date = parseIsoDate(t.date);
    return date >= start && date <= end;
  });

  const totalCap = budgets.reduce((sum, b) => sum + b.cap, 0);
  const totalSpent = budgets.reduce((sum, budget) => {
    const spent = cycleTransactions
      .filter((t) => t.type === 'expense' && t.categoryId === budget.categoryId)
      .reduce((s, t) => s + t.amount, 0);
    return sum + spent;
  }, 0);
  const totalLeft = totalCap - totalSpent;

  const items = budgets
    .map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId);
      if (!category) return null;
      const spent = cycleTransactions
        .filter((t) => t.type === 'expense' && t.categoryId === budget.categoryId)
        .reduce((s, t) => s + t.amount, 0);
      return { label: category.name, value: spent, max: budget.cap, color: category.color };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading as="h2" level={3}>
          Budgets
        </Heading>
        <Text className="mt-1 opacity-70">Current cycle: {formatCycleRange(cycle, today)}.</Text>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BalanceCard
          label="Budgeted this cycle"
          amount={formatCurrency(totalCap)}
          description={`${formatCurrency(totalSpent)} spent so far · ${formatCurrency(totalLeft)} left`}
          actions={[{ label: 'Edit cycle', onClick: () => setCycleEditorOpen(true) }]}
        />
        <BillingSummaryCard
          title="Spend by category"
          description={formatCycleRange(cycle, today)}
          items={items.map((item) => ({
            ...item,
            formatValue: (v: number, m: number) => `${formatCurrency(v)} of ${formatCurrency(m)}`,
          }))}
        />
      </div>
      <CycleEditorDialog open={cycleEditorOpen} onOpenChange={setCycleEditorOpen} />
    </div>
  );
}
