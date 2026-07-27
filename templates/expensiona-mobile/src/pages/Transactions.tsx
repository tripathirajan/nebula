import { Button } from '@nebula-lab/react-ui/button';
import { Heading } from '@nebula-lab/react-ui/heading';
import { MenuItem } from '@nebula-lab/react-ui/menu';
import { CardListItem } from '@nebula-lab/react-ui-blocks';

import { PlusIcon } from '../icons';

interface DemoTransaction {
  id: string;
  description: string;
  category: string;
  date: string;
  /** Pre-formatted with its own sign — same convention `BalanceCard.amount` documents. */
  amount: string;
  direction: 'in' | 'out';
}

const transactions: DemoTransaction[] = [
  { id: '1', description: 'Salary deposit', category: 'Salary', date: 'Today, 9:24 AM', amount: '+$4,200.00', direction: 'in' },
  { id: '2', description: 'Rent payment', category: 'Housing', date: 'Yesterday, 6:00 PM', amount: '-$1,850.00', direction: 'out' },
  { id: '3', description: 'Grocery store', category: 'Groceries', date: 'Mon, 2:15 PM', amount: '-$86.40', direction: 'out' },
  { id: '4', description: 'To Savings', category: 'Transfer', date: 'Sun, 10:00 AM', amount: '-$500.00', direction: 'out' },
  { id: '5', description: 'Freelance invoice', category: 'Side income', date: 'Fri, 3:40 PM', amount: '+$650.00', direction: 'in' },
];

function amountClassName(direction: DemoTransaction['direction']) {
  return direction === 'in' ? 'font-semibold text-[var(--color-success-text)]' : 'font-semibold';
}

export function Transactions() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Heading as="h2" level={4}>
          Transactions
        </Heading>
        <Button size="sm" color="primary">
          <PlusIcon />
          Add
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <CardListItem
            key={transaction.id}
            title={transaction.description}
            description={`${transaction.category} · ${transaction.date}`}
            trailing={<span className={amountClassName(transaction.direction)}>{transaction.amount}</span>}
            actions={
              <>
                <MenuItem onSelect={() => {}}>Edit</MenuItem>
                <MenuItem onSelect={() => {}}>Delete</MenuItem>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
