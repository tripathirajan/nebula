import { Button } from '@nebula/react-ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { DatePicker } from '@nebula/react-ui/date-picker';
import { Field, FieldControl, FieldLabel } from '@nebula/react-ui/field';
import { Input } from '@nebula/react-ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from '@nebula/react-ui/select';
import { TextArea } from '@nebula/react-ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@nebula/react-ui/toggle-group';
import * as React from 'react';

interface TransactionFormValues {
  description: string;
  /** A plain number, already parsed from the amount field's string input — always positive; `type` (not sign) carries income-vs-expense. */
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date | undefined;
  notes: string;
}

interface TransactionFormProps {
  onSubmit?: (values: TransactionFormValues) => void;
  isSubmitting?: boolean;
  error?: string;
  /** Category options — domain-neutral on purpose (see this component's doc comment): pass whatever categories your app uses (expense-tracker categories, invoice line-item types, budget buckets, ...). */
  categories: string[];
  title?: React.ReactNode;
  submitLabel?: React.ReactNode;
  className?: string;
}

/**
 * A generic income/expense entry form — named "Transaction" rather than
 * anything ecommerce-specific (no "Order"/"Payment"/"Checkout") since this
 * package is deliberately domain-neutral (see its own README): the same
 * shape serves an expense-tracker PWA, a personal-budget app, or a simple
 * internal ledger tool equally well, matching this package's own stated
 * "expense tracker vs. storefront" example of what "domain-neutral" means.
 * `categories` is a required prop rather than a hardcoded list for exactly
 * that reason — this component has no opinion on what a "category" means
 * in your app.
 *
 * Composes `Select` (categories) and `DatePicker` (transaction date)
 * alongside plain `Input`/`TextArea` fields — both are controlled
 * (`value`/`onValueChange`), so, like `LoginForm`, this holds all field
 * state in local `useState` rather than reading a native `FormData` on
 * submit (a `DatePicker`'s value has no native-form-participation story the
 * way `Input`/`Select` do, so a consistent controlled-everywhere approach
 * was chosen over a hybrid that would only work for some fields).
 *
 * `type` (income/expense) is a `ToggleGroup` rather than a `Select` —
 * there are always exactly two options, always both visible at once, so a
 * two-segment toggle reads faster than opening a dropdown for a binary
 * choice, the same reasoning any income/expense entry UI (Mint, YNAB, etc.)
 * reaches for a segmented control here instead of a `<select>`.
 *
 * @example
 * ```tsx
 * <TransactionForm
 *   categories={['Groceries', 'Rent', 'Utilities', 'Salary']}
 *   onSubmit={(values) => saveTransaction(values)}
 * />
 * ```
 */
function TransactionForm(props: TransactionFormProps) {
  const {
    onSubmit,
    isSubmitting = false,
    error,
    categories,
    title = 'Add transaction',
    submitLabel = 'Save transaction',
    className,
  } = props;

  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [type, setType] = React.useState<'income' | 'expense'>('expense');
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [notes, setNotes] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.({
      description,
      amount: Number(amount) || 0,
      type,
      category: category ?? '',
      date,
      notes,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Record a single income or expense entry.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <p role="alert" className="text-sm text-[var(--button-danger-bg)]">
              {error}
            </p>
          ) : null}

          <Field>
            <FieldLabel>Type</FieldLabel>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(value) => {
                if (value) setType(value as 'income' | 'expense');
              }}
              aria-label="Transaction type"
            >
              <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
              <ToggleGroupItem value="income">Income</ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldControl asChild>
              <Input
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="e.g. Weekly groceries"
              />
            </FieldControl>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Amount</FieldLabel>
              <FieldControl asChild>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  required
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                />
              </FieldControl>
            </Field>

            <Field>
              <FieldLabel>Date</FieldLabel>
              <DatePicker value={date} onValueChange={setDate} />
            </Field>
          </div>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  {categories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Notes</FieldLabel>
            <FieldControl asChild>
              <TextArea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional notes"
              />
            </FieldControl>
          </Field>

          <Button type="submit" loading={isSubmitting} className="w-full">
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { TransactionForm };
export type { TransactionFormProps, TransactionFormValues };
