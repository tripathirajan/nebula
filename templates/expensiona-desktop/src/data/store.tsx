import * as React from 'react';

export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountType = 'checking' | 'savings' | 'credit' | 'cash';
export type CategoryColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type RecurringFrequency = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
  subcategories: Subcategory[];
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  /** The balance before any transaction in `transactions` is applied — the actual displayed balance is always derived (`computeAccountBalance`), never stored, so adding/editing/deleting a transaction can never drift out of sync with an account's shown balance. */
  openingBalance: number;
}

export interface Transaction {
  id: string;
  description: string;
  /** Always a positive magnitude — `type` carries the sign, same convention nebula's own `BalanceCard`/`TransactionForm` blocks document. */
  amount: number;
  type: TransactionType;
  /** ISO `yyyy-mm-dd`. */
  date: string;
  /** The source account for income/expense, or the "from" account for a transfer. */
  accountId: string;
  /** Transfer destination — only set when `type === 'transfer'`. */
  toAccountId?: string;
  categoryId?: string;
  subcategoryId?: string;
  note?: string;
  /** Just the file name — no real upload/storage, this is a mock-data template. */
  receiptName?: string;
  recurring?: RecurringFrequency;
}

export interface BudgetCap {
  categoryId: string;
  cap: number;
}

export interface CycleConfig {
  /** Day of month (1-28) the budget cycle starts on — doesn't have to be the 1st. */
  startDay: number;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const signedCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatSignedCurrency(amount: number): string {
  return signedCurrencyFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** `iso` as `yyyy-mm-dd` — parsed as a local date (not UTC midnight, which `new Date(iso)` would otherwise shift a day back in any timezone west of UTC). */
export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function formatDate(iso: string): string {
  return dateFormatter.format(parseIsoDate(iso));
}

/** Positive for income, negative for expense/transfer-out — the one place that turns `type` into a sign, so every page shows the same convention. */
export function transactionSignedAmount(transaction: Transaction): number {
  return transaction.type === 'income' ? transaction.amount : -transaction.amount;
}

/** The budget cycle containing `reference` — a cycle doesn't have to start on the 1st (`cycle.startDay`), so "this cycle" means "the `startDay`-to-`startDay`-minus-a-day window `reference` currently falls in," not the calendar month. */
export function getCycleRange(cycle: CycleConfig, reference: Date): { start: Date; end: Date } {
  const day = reference.getDate();
  const anchorMonth = day >= cycle.startDay ? reference.getMonth() : reference.getMonth() - 1;
  const start = new Date(reference.getFullYear(), anchorMonth, cycle.startDay);
  const end = new Date(reference.getFullYear(), anchorMonth + 1, cycle.startDay - 1);
  return { start, end };
}

export function formatCycleRange(cycle: CycleConfig, reference: Date): string {
  const { start, end } = getCycleRange(cycle, reference);
  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}

/** Never stored — always derived from `account.openingBalance` plus every transaction touching it, so the shown balance can't drift out of sync with the transaction list. */
export function computeAccountBalance(account: Account, transactions: Transaction[]): number {
  let balance = account.openingBalance;
  for (const transaction of transactions) {
    if (transaction.type === 'transfer') {
      if (transaction.accountId === account.id) balance -= transaction.amount;
      if (transaction.toAccountId === account.id) balance += transaction.amount;
    } else if (transaction.accountId === account.id) {
      balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    }
  }
  return balance;
}

let nextId = 1000;
function generateId(): string {
  nextId += 1;
  return String(nextId);
}

const seedAccounts: Account[] = [
  { id: 'checking', name: 'Checking', type: 'checking', openingBalance: 11450 },
  { id: 'savings', name: 'Savings', type: 'savings', openingBalance: 9800 },
  { id: 'credit', name: 'Credit card', type: 'credit', openingBalance: 0 },
];

const seedCategories: Category[] = [
  { id: 'salary', name: 'Salary', color: 'success', subcategories: [] },
  { id: 'side-income', name: 'Side income', color: 'info', subcategories: [{ id: 'freelance', name: 'Freelance' }] },
  {
    id: 'housing',
    name: 'Housing',
    color: 'warning',
    subcategories: [{ id: 'rent', name: 'Rent' }, { id: 'utilities', name: 'Utilities' }],
  },
  {
    id: 'groceries',
    name: 'Groceries',
    color: 'success',
    subcategories: [{ id: 'supermarket', name: 'Supermarket' }],
  },
  { id: 'transport', name: 'Transport', color: 'info', subcategories: [{ id: 'fuel', name: 'Fuel' }] },
  { id: 'entertainment', name: 'Entertainment', color: 'accent', subcategories: [{ id: 'streaming', name: 'Streaming' }] },
  { id: 'transfer', name: 'Transfer', color: 'neutral', subcategories: [] },
];

const seedTransactions: Transaction[] = [
  { id: '1', description: 'Salary deposit', amount: 4200, type: 'income', date: '2026-07-27', accountId: 'checking', categoryId: 'salary' },
  { id: '2', description: 'Rent payment', amount: 1850, type: 'expense', date: '2026-07-26', accountId: 'checking', categoryId: 'housing', subcategoryId: 'rent', recurring: 'monthly' },
  { id: '3', description: 'Whole Foods', amount: 86.4, type: 'expense', date: '2026-07-25', accountId: 'checking', categoryId: 'groceries', subcategoryId: 'supermarket' },
  { id: '4', description: 'To Savings', amount: 500, type: 'transfer', date: '2026-07-24', accountId: 'checking', toAccountId: 'savings', categoryId: 'transfer' },
  { id: '5', description: 'Freelance invoice', amount: 650, type: 'income', date: '2026-07-22', accountId: 'checking', categoryId: 'side-income', subcategoryId: 'freelance' },
  { id: '6', description: 'Netflix', amount: 15.49, type: 'expense', date: '2026-07-20', accountId: 'credit', categoryId: 'entertainment', subcategoryId: 'streaming', recurring: 'monthly' },
  { id: '7', description: 'Gas station', amount: 54.2, type: 'expense', date: '2026-07-19', accountId: 'credit', categoryId: 'transport', subcategoryId: 'fuel' },
];

const seedBudgets: BudgetCap[] = [
  { categoryId: 'housing', cap: 1850 },
  { categoryId: 'groceries', cap: 600 },
  { categoryId: 'transport', cap: 300 },
  { categoryId: 'entertainment', cap: 250 },
];

const seedCycle: CycleConfig = { startDay: 1 };

interface StoreValue {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: BudgetCap[];
  cycle: CycleConfig;
  addTransaction: (input: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, input: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (input: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, input: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  setBudgetCap: (categoryId: string, cap: number) => void;
  setCycle: (cycle: CycleConfig) => void;
}

const StoreContext = React.createContext<StoreValue | null>(null);

export function StoreProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const [accounts] = React.useState<Account[]>(seedAccounts);
  const [categories, setCategories] = React.useState<Category[]>(seedCategories);
  const [transactions, setTransactions] = React.useState<Transaction[]>(seedTransactions);
  const [budgets, setBudgets] = React.useState<BudgetCap[]>(seedBudgets);
  const [cycle, setCycleState] = React.useState<CycleConfig>(seedCycle);

  const value = React.useMemo<StoreValue>(
    () => ({
      accounts,
      categories,
      transactions,
      budgets,
      cycle,
      addTransaction: (input) => {
        setTransactions((prev) => [{ ...input, id: generateId() }, ...prev]);
      },
      updateTransaction: (id, input) => {
        setTransactions((prev) => prev.map((t) => (t.id === id ? { ...input, id } : t)));
      },
      deleteTransaction: (id) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      },
      addCategory: (input) => {
        setCategories((prev) => [...prev, { ...input, id: generateId() }]);
      },
      updateCategory: (id, input) => {
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...input, id } : c)));
      },
      deleteCategory: (id) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setBudgets((prev) => prev.filter((b) => b.categoryId !== id));
      },
      setBudgetCap: (categoryId, cap) => {
        setBudgets((prev) => {
          const existing = prev.find((b) => b.categoryId === categoryId);
          if (existing) return prev.map((b) => (b.categoryId === categoryId ? { ...b, cap } : b));
          return [...prev, { categoryId, cap }];
        });
      },
      setCycle: (next) => setCycleState(next),
    }),
    [accounts, categories, transactions, budgets, cycle],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = React.useContext(StoreContext);
  if (!value) throw new Error('useStore must be used within a StoreProvider');
  return value;
}
