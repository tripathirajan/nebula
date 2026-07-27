import { BottomNav, BottomNavItem } from '@nebula-lab/react-ui/bottom-nav';
import { Link, useLocation } from 'react-router-dom';

import { ChartIcon, HomeIcon, TransactionsIcon, UserIcon } from '../icons';

import type { ReactNode } from 'react';

const navItems = [
  { to: '/', label: 'Home', icon: <HomeIcon /> },
  { to: '/transactions', label: 'Transactions', icon: <TransactionsIcon /> },
  { to: '/budget', label: 'Budget', icon: <ChartIcon /> },
  { to: '/profile', label: 'Profile', icon: <UserIcon /> },
];

/**
 * The app-wide phone-width shell — a centered `max-w-sm` column (the same
 * technique `mobile-banking.stories.tsx` uses to preview a phone layout on
 * a desktop-sized canvas) with a persistent `BottomNav` tab bar. Each page
 * renders its own top content rather than a shared header, since the
 * Home tab's personalized greeting strip doesn't generalize to the other
 * tabs (see `pages/Home.tsx`).
 */
export function MobileShell(props: { children: ReactNode }) {
  const { children } = props;
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col bg-[var(--color-base-200)]">
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      <BottomNav>
        {navItems.map((item) => (
          <BottomNavItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to}
            asChild
          >
            <Link to={item.to} />
          </BottomNavItem>
        ))}
      </BottomNav>
    </div>
  );
}
