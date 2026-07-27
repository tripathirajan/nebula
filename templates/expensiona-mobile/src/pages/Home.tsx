import { Avatar, AvatarFallback } from '@nebula-lab/react-ui/avatar';
import { Card } from '@nebula-lab/react-ui/card';
import { IconButton } from '@nebula-lab/react-ui/icon-button';
import { Text } from '@nebula-lab/react-ui/text';
import { BalanceCard, ThumbnailList } from '@nebula-lab/react-ui-blocks/dashboard';

import { BellIcon } from '../icons';

interface AccountTileProps {
  label: string;
  amount: string;
  color: 'primary' | 'info';
}

function AccountTile(props: AccountTileProps) {
  const { label, amount, color } = props;
  return (
    <Card
      variant="outlined"
      className="flex flex-col gap-1 p-4"
      style={{
        // Mixed with `transparent`, not a surface token — see
        // `mobile-banking.stories.tsx`'s `AccountTile` for why a chromatic
        // + neutral-with-a-hue mix shifts the resulting color unexpectedly.
        backgroundColor: `color-mix(in oklch, var(--color-${color}) 18%, transparent)`,
        borderColor: `color-mix(in oklch, var(--color-${color}) 40%, transparent)`,
      }}
    >
      <Text className="text-xs opacity-70">{label}</Text>
      <Text className="text-lg font-bold">{amount}</Text>
    </Card>
  );
}

const transactions = [
  {
    id: '1',
    thumbnail: (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 3H8l-2 4h12z" />
        </svg>
      </span>
    ),
    label: 'Salary deposit',
    description: 'Today, 9:24 AM',
    trend: { direction: 'up' as const, value: '+$4,200.00' },
  },
  {
    id: '2',
    thumbnail: (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)]">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
          <path d="M3 9.5 12 3l9 6.5" />
          <path d="M5 9v10h14V9" />
        </svg>
      </span>
    ),
    label: 'Rent payment',
    description: 'Yesterday, 6:00 PM',
    trend: { direction: 'down' as const, value: '-$1,850.00' },
  },
  {
    id: '3',
    thumbnail: (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-info)]/10 text-[var(--color-info)]">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>
    ),
    label: 'Grocery store',
    description: 'Mon, 2:15 PM',
    trend: { direction: 'down' as const, value: '-$86.40' },
  },
];

export function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3 bg-[var(--color-base-100)] px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>J</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Text className="text-xs opacity-70">Good morning</Text>
            <Text className="text-sm font-semibold">Jayvion Simon</Text>
          </div>
        </div>
        <IconButton aria-label="Notifications" variant="text" color="neutral">
          <BellIcon />
        </IconButton>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <BalanceCard
          label="Total balance"
          amount="$24,500.00"
          description="+2.5% from last month"
          actions={[
            { label: 'Add expense', onClick: () => {} },
            { label: 'Add income', onClick: () => {} },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <AccountTile label="Checking" amount="$14,200.00" color="primary" />
          <AccountTile label="Savings" amount="$10,300.00" color="info" />
        </div>
        <ThumbnailList title="Recent transactions" items={transactions} />
      </div>
    </div>
  );
}
