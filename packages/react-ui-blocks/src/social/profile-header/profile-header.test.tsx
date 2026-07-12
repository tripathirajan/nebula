import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ProfileHeader } from './profile-header';

const tabs = [
  { value: 'profile', label: 'Profile', content: 'Bio content' },
  { value: 'gallery', label: 'Gallery', content: 'Gallery content' },
];

describe('ProfileHeader (block)', () => {
  it('renders the name, job title, and avatar fallback', () => {
    render(<ProfileHeader avatarFallback="J" name="Jayvion Simon" jobTitle="UI Designer" />);
    expect(screen.getByRole('heading', { name: 'Jayvion Simon' })).toBeInTheDocument();
    expect(screen.getByText('UI Designer')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders stats only when given', () => {
    const { rerender } = render(<ProfileHeader avatarFallback="J" name="Jayvion Simon" />);
    expect(screen.queryByText('Followers')).not.toBeInTheDocument();

    rerender(
      <ProfileHeader avatarFallback="J" name="Jayvion Simon" stats={[{ label: 'Followers', value: '1.2k' }]} />,
    );
    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  it('renders tabs and their panels, with aria-controls resolving to a real panel id', () => {
    render(<ProfileHeader avatarFallback="J" name="Jayvion Simon" tabs={tabs} defaultActiveTab="profile" />);
    const tab = screen.getByRole('tab', { name: 'Profile' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(screen.getByText('Bio content')).toBeInTheDocument();
  });

  it('switches tabs and reports the change', () => {
    const onActiveTabChange = vi.fn();
    render(
      <ProfileHeader
        avatarFallback="J"
        name="Jayvion Simon"
        tabs={tabs}
        activeTab="profile"
        onActiveTabChange={onActiveTabChange}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Gallery' }));
    expect(onActiveTabChange).toHaveBeenCalledWith('gallery');
  });

  it('omits the tab list when tabs is not given', () => {
    render(<ProfileHeader avatarFallback="J" name="Jayvion Simon" />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ProfileHeader
        avatarFallback="J"
        name="Jayvion Simon"
        jobTitle="UI Designer"
        stats={[{ label: 'Followers', value: '1.2k' }]}
        tabs={tabs}
        defaultActiveTab="profile"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
