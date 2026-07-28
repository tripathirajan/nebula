import { Button } from '@nebula-lab/react-ui/button';
import { DatePicker } from '@nebula-lab/react-ui/date-picker';
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '@nebula-lab/react-ui/dialog';
import { Field, FieldControl, FieldLabel } from '@nebula-lab/react-ui/field';
import { ImageUpload } from '@nebula-lab/react-ui/image-upload';
import { Input } from '@nebula-lab/react-ui/input';
import { Select, SelectContent, SelectItem, SelectPortal, SelectTrigger, SelectValue } from '@nebula-lab/react-ui/select';
import { Switch } from '@nebula-lab/react-ui/switch';
import { TextArea } from '@nebula-lab/react-ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@nebula-lab/react-ui/toggle-group';
import * as React from 'react';

import { useStore } from '../data/store';

import type { RecurringFrequency, Transaction, TransactionType } from '../data/store';

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this transaction instead of creating a new one. */
  transaction?: Transaction;
  /** Pre-selects this account for a new transaction — e.g. an account detail page's own "Add transaction" entry point. Ignored when `transaction` is set (editing keeps that transaction's own account). */
  defaultAccountId?: string;
}

/** One place both "Add transaction" (every page) and "Edit" (row actions) open — covers income/expense/transfer, category+subcategory, a receipt image, and a recurring toggle, the fields a generic domain-neutral form (`@nebula-lab/react-ui-blocks`' own `TransactionForm`) deliberately doesn't carry since accounts/transfers/receipts are expense-tracker-specific, not domain-neutral. */
export function TransactionFormDialog(props: TransactionFormDialogProps) {
  const { open, onOpenChange, transaction, defaultAccountId } = props;
  const { accounts, categories, addTransaction, updateTransaction } = useStore();

  const [type, setType] = React.useState<TransactionType>('expense');
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [accountId, setAccountId] = React.useState<string | undefined>(accounts[0]?.id);
  const [toAccountId, setToAccountId] = React.useState<string | undefined>(accounts[1]?.id);
  const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined);
  const [subcategoryId, setSubcategoryId] = React.useState<string | undefined>(undefined);
  const [note, setNote] = React.useState('');
  const [receiptFiles, setReceiptFiles] = React.useState<File[]>([]);
  const [recurringEnabled, setRecurringEnabled] = React.useState(false);
  const [recurringFrequency, setRecurringFrequency] = React.useState<RecurringFrequency>('monthly');

  React.useEffect(() => {
    if (!open) return;
    if (transaction) {
      setType(transaction.type);
      setDescription(transaction.description);
      setAmount(String(transaction.amount));
      setDate(new Date(transaction.date));
      setAccountId(transaction.accountId);
      setToAccountId(transaction.toAccountId ?? accounts.find((a) => a.id !== transaction.accountId)?.id);
      setCategoryId(transaction.categoryId);
      setSubcategoryId(transaction.subcategoryId);
      setNote(transaction.note ?? '');
      setReceiptFiles([]);
      setRecurringEnabled(Boolean(transaction.recurring && transaction.recurring !== 'none'));
      setRecurringFrequency(transaction.recurring && transaction.recurring !== 'none' ? transaction.recurring : 'monthly');
    } else {
      setType('expense');
      setDescription('');
      setAmount('');
      setDate(new Date());
      setAccountId(defaultAccountId ?? accounts[0]?.id);
      setToAccountId(accounts.find((a) => a.id !== defaultAccountId)?.id ?? accounts[1]?.id);
      setCategoryId(undefined);
      setSubcategoryId(undefined);
      setNote('');
      setReceiptFiles([]);
      setRecurringEnabled(false);
      setRecurringFrequency('monthly');
    }
    // Re-seed the form only when the dialog opens or which transaction/default account it targets changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transaction, defaultAccountId]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accountId || !date) return;

    const input = {
      description,
      amount: Number(amount) || 0,
      type,
      date: date.toISOString().slice(0, 10),
      accountId,
      toAccountId: type === 'transfer' ? toAccountId : undefined,
      categoryId: type === 'transfer' ? 'transfer' : categoryId,
      subcategoryId: type === 'transfer' ? undefined : subcategoryId,
      note: note || undefined,
      receiptName: receiptFiles[0]?.name,
      recurring: recurringEnabled ? recurringFrequency : ('none' as const),
    };

    if (transaction) {
      updateTransaction(transaction.id, input);
    } else {
      addTransaction(input);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-h-[85vh] w-full max-w-lg overflow-y-auto">
          <DialogTitle>{transaction ? 'Edit transaction' : 'Add transaction'}</DialogTitle>
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <ToggleGroup
                type="single"
                value={type}
                onValueChange={(value) => {
                  if (value) setType(value as TransactionType);
                }}
                aria-label="Transaction type"
              >
                <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
                <ToggleGroupItem value="income">Income</ToggleGroupItem>
                <ToggleGroupItem value="transfer">Transfer</ToggleGroupItem>
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

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{type === 'transfer' ? 'From account' : 'Account'}</FieldLabel>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an account" />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Field>
              {type === 'transfer' ? (
                <Field>
                  <FieldLabel>To account</FieldLabel>
                  <Select value={toAccountId} onValueChange={setToAccountId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an account" />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectContent>
                        {accounts
                          .filter((account) => account.id !== accountId)
                          .map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </Field>
              ) : (
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    value={categoryId}
                    onValueChange={(value) => {
                      setCategoryId(value);
                      setSubcategoryId(undefined);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectContent>
                        {categories
                          .filter((category) => category.id !== 'transfer')
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </Field>
              )}
            </div>

            {type !== 'transfer' && selectedCategory && selectedCategory.subcategories.length > 0 ? (
              <Field>
                <FieldLabel>Subcategory</FieldLabel>
                <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subcategory" />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {selectedCategory.subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Field>
            ) : null}

            <Field>
              <FieldLabel>Note</FieldLabel>
              <FieldControl asChild>
                <TextArea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional note" />
              </FieldControl>
            </Field>

            <Field>
              <FieldLabel>Receipt</FieldLabel>
              <ImageUpload files={receiptFiles} onFilesChange={setReceiptFiles} />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0">Repeat this transaction</FieldLabel>
                <Switch checked={recurringEnabled} onCheckedChange={setRecurringEnabled} aria-label="Repeat this transaction" />
              </div>
            </Field>

            {recurringEnabled ? (
              <Field>
                <FieldLabel>Frequency</FieldLabel>
                <ToggleGroup
                  type="single"
                  value={recurringFrequency}
                  onValueChange={(value) => {
                    if (value) setRecurringFrequency(value as RecurringFrequency);
                  }}
                  aria-label="Recurring frequency"
                >
                  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                  <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                </ToggleGroup>
              </Field>
            ) : null}

            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" color="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {transaction ? 'Save changes' : 'Add transaction'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
