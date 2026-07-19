import { Avatar, AvatarFallback } from '@nebula-lab/react-ui/avatar';
import { BottomNav } from '@nebula-lab/react-ui/bottom-nav';
import { BottomNavItem } from '@nebula-lab/react-ui/bottom-nav';
import { Card } from '@nebula-lab/react-ui/card';
import { IconButton } from '@nebula-lab/react-ui/icon-button';
import { Text } from '@nebula-lab/react-ui/text';

import { BalanceCard } from '../dashboard/billing/balance-card';
import { ThumbnailList } from '../dashboard/widgets/thumbnail-list';

import type { Meta, StoryObj } from '@storybook/react';

// Assembled-page story — see saas-dashboard-home.stories.tsx's header
// comment for the "Assembled Page" pattern (BLOCKS_ARCHITECTURE.md §9). No
// component of its own; `AccountTile`/the icon helpers below are local,
// unexported demo-only pieces, same convention every other composition's
// inline icon components already follow — a real app's own account-tile
// shape (which fields, which colors) is too product-specific to belong in
// the shared library, so this only demonstrates the pattern using
// existing blocks (`BalanceCard`, `ThumbnailList`) plus `react-ui`'s
// `BottomNav`.
const meta = {
  title: 'Blocks/Compositions/Mobile Banking',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // BottomNav is `md:hidden` by design (a phone-width pattern) — pin the
    // canvas to a mobile viewport so it's actually visible, same technique
    // SaasAppHeader's own `MobileMenu` story uses.
    viewport: { defaultViewport: 'mobile1' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  );
}

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
        // Mixed with `transparent`, not `var(--card-bg)` — mixing two
        // genuinely chromatic colors in oklch is predictable, but mixing
        // with a nominally-neutral surface token that still carries a
        // faint hue produces a visible, unwanted hue shift at low mix
        // percentages (confirmed live: an info-blue tile rendered pink).
        // `transparent` is the same technique `DashboardOverview`'s icon
        // badge and `Button`'s ghost/text tinted backgrounds already use.
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

export const Default: Story = {
  render: () => (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[var(--color-base-200)]">
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

      <div className="flex flex-1 flex-col gap-4 p-4 pb-24">
        <BalanceCard
          label="Total balance"
          amount="$24,500.00"
          description="+2.5% from last month"
          actions={[
            { label: 'Send', onClick: () => {} },
            { label: 'Top up', onClick: () => {} },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <AccountTile label="Checking" amount="$14,200.00" color="primary" />
          <AccountTile label="Savings" amount="$10,300.00" color="info" />
        </div>
        <ThumbnailList title="Recent transactions" items={transactions} />
      </div>

      <BottomNav>
        <BottomNavItem icon={<HomeIcon />} label="Home" active href="#home" />
        <BottomNavItem icon={<CardIcon />} label="Cards" href="#cards" />
        <BottomNavItem icon={<ChartIcon />} label="Stats" href="#stats" />
        <BottomNavItem icon={<UserIcon />} label="Profile" href="#profile" />
      </BottomNav>
    </div>
  ),
};
