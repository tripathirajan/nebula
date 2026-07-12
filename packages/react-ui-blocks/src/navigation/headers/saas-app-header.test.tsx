import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SaasAppHeader } from './saas-app-header';

describe('SaasAppHeader (block)', () => {
  it('renders a text brand and an optional logo', () => {
    render(<SaasAppHeader brand="Acme" logo={<svg role="img" aria-label="Acme logo" />} />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('renders nav links with aria-current on the active one', () => {
    render(
      <SaasAppHeader
        brand="Acme"
        navLinks={[
          { label: 'Overview', href: '#overview', active: true },
          { label: 'Reports', href: '#reports' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Reports' })).not.toHaveAttribute('aria-current');
  });

  it('renders a nav item with sub-items as a dropdown trigger', async () => {
    const user = userEvent.setup();
    render(
      <SaasAppHeader
        brand="Acme"
        navLinks={[
          {
            label: 'Products',
            items: [{ label: 'Analytics', href: '#analytics' }, { label: 'Billing', href: '#billing' }],
          },
        ]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(trigger).toBeInTheDocument();
    await user.click(trigger);
    expect(await within(document.body).findByRole('link', { name: 'Analytics' })).toBeInTheDocument();
  });

  it('does not render the mobile menu trigger when there are no nav links', () => {
    render(<SaasAppHeader brand="Acme" />);
    expect(screen.queryByRole('button', { name: 'Open navigation menu' })).not.toBeInTheDocument();
  });

  it('opens the mobile menu sheet listing the same nav links', async () => {
    const user = userEvent.setup();
    // Two nav renders coexist in jsdom (no real CSS engine to apply the
    // `hidden md:block` / `md:hidden` responsive split that keeps only one
    // visible in a real browser) — scope the query to the sheet dialog so
    // it doesn't also match the desktop NavigationMenu's own "Overview" link.
    render(<SaasAppHeader brand="Acme" navLinks={[{ label: 'Overview', href: '#overview' }]} />);
    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const dialog = await within(document.body).findByRole('dialog');
    expect(within(dialog).getByRole('link', { name: 'Overview' })).toBeInTheDocument();
  });

  it('does not render the notification bell when notifications is omitted', () => {
    render(<SaasAppHeader brand="Acme" />);
    expect(screen.queryByRole('button', { name: /Notifications/ })).not.toBeInTheDocument();
  });

  it('shows an unread count in the bell label and opens the notification list', async () => {
    const user = userEvent.setup();
    render(
      <SaasAppHeader
        brand="Acme"
        notifications={[
          { id: '1', title: 'New comment', read: false },
          { id: '2', title: 'Old comment', read: true },
        ]}
      />,
    );
    const bell = screen.getByRole('button', { name: 'Notifications (1 unread)' });
    await user.click(bell);
    expect(await within(document.body).findByText('New comment')).toBeInTheDocument();
    expect(within(document.body).getByText('Old comment')).toBeInTheDocument();
  });

  it('calls onNotificationClick when a notification is clicked', async () => {
    const user = userEvent.setup();
    const onNotificationClick = vi.fn();
    render(
      <SaasAppHeader
        brand="Acme"
        notifications={[{ id: '1', title: 'New comment', read: false }]}
        onNotificationClick={onNotificationClick}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Notifications (1 unread)' }));
    await user.click(await within(document.body).findByText('New comment'));
    expect(onNotificationClick).toHaveBeenCalledWith('1');
  });

  it('shows an empty state when notifications is an empty array', async () => {
    const user = userEvent.setup();
    render(<SaasAppHeader brand="Acme" notifications={[]} />);
    await user.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(await within(document.body).findByText("You're all caught up.")).toBeInTheDocument();
  });

  it('shows AvatarFallback initials when avatarSrc is omitted', () => {
    render(<SaasAppHeader brand="Acme" user={{ name: 'Jane Cooper' }} />);
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jane Cooper account menu' })).toBeInTheDocument();
  });

  it('shows name and role at the top of the opened user menu, not beside the trigger', async () => {
    const user = userEvent.setup();
    render(<SaasAppHeader brand="Acme" user={{ name: 'Jane Cooper', role: 'Admin' }} />);
    expect(screen.queryByText('Jane Cooper')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Jane Cooper account menu' }));
    expect(await within(document.body).findByText('Jane Cooper')).toBeInTheDocument();
    expect(within(document.body).getByText('Admin')).toBeInTheDocument();
  });

  it('opens the user menu and calls onSelect for a clicked item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SaasAppHeader
        brand="Acme"
        user={{ name: 'Jane Cooper' }}
        userMenuItems={[{ label: 'Sign out', onSelect }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Jane Cooper account menu' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Sign out' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SaasAppHeader
        brand="Acme"
        navLinks={[{ label: 'Overview', href: '#overview', active: true }]}
        notifications={[{ id: '1', title: 'New comment', read: false }]}
        user={{ name: 'Jane Cooper', role: 'Admin' }}
        userMenuItems={[{ label: 'Settings' }, { label: 'Sign out', separatorBefore: true }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
