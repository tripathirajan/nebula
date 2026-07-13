import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { TeamMemberCard } from './team-member-card';

describe('TeamMemberCard (block)', () => {
  it('renders the name, job title, and avatar fallback', () => {
    render(<TeamMemberCard avatarFallback="J" name="Jayvion Simon" jobTitle="UI Designer" />);
    expect(screen.getByText('Jayvion Simon')).toBeInTheDocument();
    expect(screen.getByText('UI Designer')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders a link per social item with its accessible name', () => {
    render(
      <TeamMemberCard
        avatarFallback="J"
        name="Jayvion Simon"
        socialLinks={[{ icon: <span />, href: 'https://twitter.com', label: 'Twitter' }]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Twitter' })).toHaveAttribute('href', 'https://twitter.com');
  });

  it('renders stats only when given', () => {
    const { rerender } = render(<TeamMemberCard avatarFallback="J" name="Jayvion Simon" />);
    expect(screen.queryByText('Followers')).not.toBeInTheDocument();

    rerender(
      <TeamMemberCard avatarFallback="J" name="Jayvion Simon" stats={[{ label: 'Followers', value: '1.2k' }]} />,
    );
    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <TeamMemberCard
        avatarFallback="J"
        name="Jayvion Simon"
        jobTitle="UI Designer"
        socialLinks={[{ icon: <span />, href: 'https://twitter.com', label: 'Twitter' }]}
        stats={[{ label: 'Followers', value: '1.2k' }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
