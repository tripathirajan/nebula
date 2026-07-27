import { Logo } from '@nebula-lab/react-ui/logo';
import { Main } from '@nebula-lab/react-ui/main';
import { SideNav } from '@nebula-lab/react-ui/side-nav';
import { SideNavItem } from '@nebula-lab/react-ui/side-nav';
import { Sidebar } from '@nebula-lab/react-ui/sidebar';
import { Text } from '@nebula-lab/react-ui/text';
import { ThemeSwitcher } from '@nebula-lab/react-ui/theme-switcher';
import { SaasAppHeader } from '@nebula-lab/react-ui-blocks';
import { Link, useLocation } from 'react-router-dom';

import { HomeIcon, TargetIcon, TransactionsIcon, WalletIcon } from '../icons';

import type { ReactNode } from 'react';

const navItems = [
  { to: '/', label: 'Overview', icon: <HomeIcon /> },
  { to: '/transactions', label: 'Transactions', icon: <TransactionsIcon /> },
  { to: '/accounts', label: 'Accounts', icon: <WalletIcon /> },
  { to: '/budgets', label: 'Budgets', icon: <TargetIcon /> },
];

/**
 * The app-wide desktop shell — `Sidebar` + `SideNav` on the left, a
 * `SaasAppHeader` + `Main` column on the right. `SaasAppHeader`'s own
 * `navLinks` doubles as the mobile nav fallback (its built-in hamburger
 * menu), since `Sidebar` hides itself below `md` by design.
 */
export function AppShell(props: { children: ReactNode }) {
  const { children } = props;
  const location = useLocation();

  return (
    <div className="flex min-h-svh bg-[var(--color-base-200)]">
      {/* `sticky top-0 h-svh` — without a height constraint `Sidebar`
          stretches to match `Main`'s content height (plain flexbox
          stretch-alignment), so on any page taller than the viewport the
          nav links and theme toggle scroll away with the page instead of
          staying reachable. `SideNav`'s own `overflow-y-auto` gives the nav
          list (not the header/footer rows around it) the scrolling if it
          ever grows past the fixed height instead. */}
      <Sidebar className="sticky top-0 h-svh">
        {/* `-mx-4 -mt-4`/`-mb-4` bleed these two rows past `Sidebar`'s own
            `p-4` so their dividers reach the sidebar's full width. */}
        <div className="-mx-4 -mt-4 flex h-14 items-center gap-2 border-b border-[var(--color-base-300)] px-4">
          <Logo size={22} className="text-[var(--color-primary)]" />
          <Text className="text-sm font-semibold">Expensiona</Text>
        </div>
        <SideNav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => (
            <SideNavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
              asChild
            >
              <Link to={item.to} />
            </SideNavItem>
          ))}
        </SideNav>
        <div className="-mx-4 -mb-4 mt-auto flex items-center justify-between border-t border-[var(--color-base-300)] px-4 py-4">
          <Text className="text-xs opacity-60">Theme</Text>
          <ThemeSwitcher />
        </div>
      </Sidebar>

      <div className="flex flex-1 flex-col">
        <SaasAppHeader
          brand="Expensiona"
          navLinks={navItems.map((item) => ({
            label: item.label,
            href: item.to,
            active: location.pathname === item.to,
          }))}
          user={{ name: 'Jane Cooper', role: 'Account owner' }}
        />
        <Main className="mx-auto w-full max-w-6xl p-6">{children}</Main>
      </div>
    </div>
  );
}
