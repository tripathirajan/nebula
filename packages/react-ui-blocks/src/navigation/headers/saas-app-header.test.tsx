import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SaasAppHeader } from './saas-app-header';

describe('SaasAppHeader (block)', () => {
  it('renders a text brand', () => {
    render(<SaasAppHeader brand="Acme" />);
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

  it('does not render a user menu when user is omitted', () => {
    render(<SaasAppHeader brand="Acme" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows AvatarFallback initials when avatarSrc is omitted', () => {
    render(<SaasAppHeader brand="Acme" user={{ name: 'Jane Cooper' }} />);
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jane Cooper account menu' })).toBeInTheDocument();
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
        user={{ name: 'Jane Cooper' }}
        userMenuItems={[{ label: 'Settings' }, { label: 'Sign out', separatorBefore: true }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
