import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SideNavGroup } from './side-nav-group';
import { SideNavItem } from './side-nav-item';

describe('SideNavGroup (ui)', () => {
  it('renders a labeled group with its items', () => {
    render(
      <SideNavGroup label="Settings">
        <SideNavItem icon={<span />} label="Profile" href="/settings/profile" />
      </SideNavGroup>,
    );
    const group = screen.getByRole('group', { name: 'Settings' });
    expect(group).toHaveTextContent('Profile');
  });

  it('associates the label via aria-labelledby, not just visual proximity', () => {
    render(
      <SideNavGroup label="Settings">
        <SideNavItem icon={<span />} label="Profile" href="/settings/profile" />
      </SideNavGroup>,
    );
    const group = screen.getByRole('group');
    const labelledBy = group.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy ?? '')).toHaveTextContent('Settings');
  });

  it('visually hides the label when collapsed, but keeps it in the accessible name', () => {
    render(
      <SideNavGroup label="Settings" collapsed>
        <SideNavItem icon={<span />} label="Profile" href="/settings/profile" collapsed />
      </SideNavGroup>,
    );
    expect(screen.getByRole('group', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Settings').className).toContain('sr-only');
  });
});
