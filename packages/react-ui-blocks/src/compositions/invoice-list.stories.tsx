import { Badge } from '@nebula-lab/react-ui/badge';
import { Button } from '@nebula-lab/react-ui/button';
import { MenuItem } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';
import { useState } from 'react';

import { DataTableBlock } from '../data-display/data-table/data-table-block';
import { PageSection } from '../layouts/page-section/page-section';

import type { Meta, StoryObj } from '@storybook/react';

// Assembled-page story — see saas-dashboard-home.stories.tsx's header
// comment for the "Assembled Page" pattern (BLOCKS_ARCHITECTURE.md §9). No
// component of its own — structurally identical to user-list.stories.tsx's
// own PageSection+DataTableBlock shell, per BLOCKS_ARCHITECTURE.md §5's own
// "Table Block" variant note: only the column schema and status vocabulary
// change between an entity list and an invoice list, not the shape.
const meta = {
  title: 'Blocks/Compositions/Invoice List',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface DemoInvoice {
  id: string;
  invoiceNumber: string;
  client: string;
  issueDate: string;
  dueDate: string;
  /** Pre-formatted, e.g. `"$1,240.00"` — same no-currency-opinion convention `ProductCard.price`/`BalanceCard.amount` use. */
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
}

const allInvoices: DemoInvoice[] = [
  { id: '1', invoiceNumber: 'INV-2026-0142', client: 'Wuckert Inc', issueDate: 'Jun 12, 2026', dueDate: 'Jul 12, 2026', amount: '$4,200.00', status: 'paid' },
  { id: '2', invoiceNumber: 'INV-2026-0143', client: 'Feest Group', issueDate: 'Jun 18, 2026', dueDate: 'Jul 18, 2026', amount: '$1,850.00', status: 'pending' },
  { id: '3', invoiceNumber: 'INV-2026-0144', client: 'Kihn, Marquardt and Crist', issueDate: 'May 30, 2026', dueDate: 'Jun 30, 2026', amount: '$920.00', status: 'overdue' },
  { id: '4', invoiceNumber: 'INV-2026-0145', client: 'Rempel, Hand and Herzog', issueDate: 'Jun 25, 2026', dueDate: 'Jul 25, 2026', amount: '$3,100.00', status: 'paid' },
  { id: '5', invoiceNumber: 'INV-2026-0146', client: 'Mraz, Donnelly and Collins', issueDate: 'Jun 28, 2026', dueDate: 'Jul 28, 2026', amount: '$640.00', status: 'pending' },
];

const statusColor: Record<DemoInvoice['status'], 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
};

function InvoiceListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = allInvoices
    .filter((invoice) => activeTab === 'all' || invoice.status === activeTab)
    .filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        invoice.client.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="min-h-screen bg-[var(--color-base-200)] p-6">
      <div className="mx-auto max-w-6xl">
        <PageSection
          title="Invoices"
          description="Track billing status and payment due dates across every client."
          actions={<Button color="primary">New invoice</Button>}
        >
          <DataTableBlock
            columns={[
              {
                key: 'invoiceNumber',
                header: 'Invoice',
                sortable: true,
                render: (invoice) => (
                  <div>
                    <Text className="text-sm font-medium">{invoice.invoiceNumber}</Text>
                    <Text className="text-xs opacity-70">{invoice.client}</Text>
                  </div>
                ),
              },
              { key: 'issueDate', header: 'Issue date', render: (invoice) => invoice.issueDate },
              { key: 'dueDate', header: 'Due date', render: (invoice) => invoice.dueDate },
              {
                key: 'amount',
                header: 'Amount',
                sortable: true,
                render: (invoice) => <Text className="text-sm font-medium">{invoice.amount}</Text>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (invoice) => (
                  <Badge color={statusColor[invoice.status]}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                ),
              },
            ]}
            rows={filtered}
            getRowId={(invoice) => invoice.id}
            tabs={[
              { value: 'all', label: 'All', count: allInvoices.length },
              { value: 'paid', label: 'Paid', count: allInvoices.filter((i) => i.status === 'paid').length },
              { value: 'pending', label: 'Pending', count: allInvoices.filter((i) => i.status === 'pending').length },
              { value: 'overdue', label: 'Overdue', count: allInvoices.filter((i) => i.status === 'overdue').length },
            ]}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            searchPlaceholder="Search by invoice # or client…"
            searchValue={search}
            onSearchChange={setSearch}
            selectable
            rowActions={() => (
              <>
                <MenuItem onSelect={() => {}}>View</MenuItem>
                <MenuItem onSelect={() => {}}>Download PDF</MenuItem>
                <MenuItem onSelect={() => {}}>Send reminder</MenuItem>
                <MenuItem onSelect={() => {}}>Delete</MenuItem>
              </>
            )}
            rowActionsLabel={(invoice) => `Actions for ${invoice.invoiceNumber}`}
            page={1}
            totalCount={filtered.length}
          />
        </PageSection>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <InvoiceListPage />,
};
