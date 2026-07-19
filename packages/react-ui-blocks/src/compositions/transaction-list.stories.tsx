import { Badge } from '@nebula-lab/react-ui/badge';
import { Button } from '@nebula-lab/react-ui/button';
import { MenuItem } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';
import { useState } from 'react';

import { CardListItem } from '../data-display/card-list-item/card-list-item';
import { DataTableBlock } from '../data-display/data-table/data-table-block';
import { PageSection } from '../layouts/page-section/page-section';

import type { Meta, StoryObj } from '@storybook/react';

// Assembled-page story — see saas-dashboard-home.stories.tsx's header
// comment for the "Assembled Page" pattern (BLOCKS_ARCHITECTURE.md §9). No
// component of its own — structurally identical to user-list.stories.tsx's
// own PageSection+DataTableBlock shell, per BLOCKS_ARCHITECTURE.md §5's own
// "Table Block" variant note. Exists specifically to demonstrate
// DataTableBlock's `renderCard` responsive switch on a row shape that
// isn't a person (a transaction has no natural avatar) — `CardListItem`'s
// `icon` slot, not `avatar`, carries the leading visual here. Resize the
// Storybook viewport below 768px (or use the toolbar's Mobile preset) to
// see it swap from the table to a stacked `CardListItem` list.
const meta = {
  title: 'Blocks/Compositions/Transaction List',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface DemoTransaction {
  id: string;
  description: string;
  category: string;
  date: string;
  /** Pre-formatted with its own sign, e.g. `"+$1,240.00"`/`"-$42.50"` — same no-currency-opinion convention `BalanceCard.amount`/`ProductCard.price` use. */
  amount: string;
  direction: 'in' | 'out';
  status: 'completed' | 'pending' | 'failed';
}

const allTransactions: DemoTransaction[] = [
  { id: '1', description: 'Stripe payout', category: 'Payout', date: 'Oct 12, 2026', amount: '+$1,240.00', direction: 'in', status: 'completed' },
  { id: '2', description: 'AWS', category: 'Software', date: 'Oct 11, 2026', amount: '-$284.12', direction: 'out', status: 'completed' },
  { id: '3', description: 'Client refund — Wuckert Inc', category: 'Refund', date: 'Oct 10, 2026', amount: '-$420.00', direction: 'out', status: 'pending' },
  { id: '4', description: 'Figma', category: 'Software', date: 'Oct 9, 2026', amount: '-$45.00', direction: 'out', status: 'completed' },
  { id: '5', description: 'Wire transfer — Feest Group', category: 'Payment', date: 'Oct 7, 2026', amount: '+$3,600.00', direction: 'in', status: 'failed' },
];

const statusColor: Record<DemoTransaction['status'], 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

function DollarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function TransactionListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = allTransactions
    .filter((transaction) => activeTab === 'all' || transaction.status === activeTab)
    .filter((transaction) => transaction.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[var(--color-base-200)] p-6">
      <div className="mx-auto max-w-6xl">
        <PageSection
          title="Transactions"
          description="A record of every payment in and out of your account."
          actions={<Button color="primary">Export</Button>}
        >
          <DataTableBlock
            columns={[
              {
                key: 'description',
                header: 'Description',
                sortable: true,
                render: (transaction) => (
                  <div>
                    <Text className="text-sm font-medium">{transaction.description}</Text>
                    <Text className="text-xs opacity-70">{transaction.category}</Text>
                  </div>
                ),
              },
              { key: 'date', header: 'Date', render: (transaction) => transaction.date },
              {
                key: 'amount',
                header: 'Amount',
                sortable: true,
                render: (transaction) => (
                  <Text
                    className={
                      transaction.direction === 'in'
                        ? 'text-sm font-medium text-[var(--color-success-text)]'
                        : 'text-sm font-medium'
                    }
                  >
                    {transaction.amount}
                  </Text>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (transaction) => (
                  <Badge color={statusColor[transaction.status]}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                ),
              },
            ]}
            rows={filtered}
            getRowId={(transaction) => transaction.id}
            tabs={[
              { value: 'all', label: 'All', count: allTransactions.length },
              { value: 'completed', label: 'Completed', count: allTransactions.filter((t) => t.status === 'completed').length },
              { value: 'pending', label: 'Pending', count: allTransactions.filter((t) => t.status === 'pending').length },
              { value: 'failed', label: 'Failed', count: allTransactions.filter((t) => t.status === 'failed').length },
            ]}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            searchPlaceholder="Search transactions…"
            searchValue={search}
            onSearchChange={setSearch}
            rowActions={() => (
              <>
                <MenuItem onSelect={() => {}}>View receipt</MenuItem>
                <MenuItem onSelect={() => {}}>Dispute</MenuItem>
              </>
            )}
            rowActionsLabel={(transaction) => `Actions for ${transaction.description}`}
            renderCard={(transaction) => (
              <CardListItem
                icon={<DollarIcon />}
                title={transaction.description}
                description={transaction.date}
                trailing={
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={
                        transaction.direction === 'in'
                          ? 'font-semibold text-[var(--color-success-text)]'
                          : 'font-semibold'
                      }
                    >
                      {transaction.amount}
                    </span>
                    <Badge color={statusColor[transaction.status]}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </div>
                }
                actions={
                  <>
                    <MenuItem onSelect={() => {}}>View receipt</MenuItem>
                    <MenuItem onSelect={() => {}}>Dispute</MenuItem>
                  </>
                }
              />
            )}
            page={1}
            totalCount={filtered.length}
          />
        </PageSection>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <TransactionListPage />,
};
