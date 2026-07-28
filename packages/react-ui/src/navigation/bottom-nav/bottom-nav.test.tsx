import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { BottomNav } from './bottom-nav';
import { BottomNavItem } from './bottom-nav-item';

describe('BottomNav (ui)', () => {
  it('renders a nav landmark', () => {
    render(
      <BottomNav>
        <BottomNavItem icon={<span />} label="Home" href="#" />
      </BottomNav>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('sets aria-current="page" only on the active item', () => {
    render(
      <BottomNav>
        <BottomNavItem icon={<span />} label="Home" href="#" active />
        <BottomNavItem icon={<span />} label="Search" href="#" />
      </BottomNav>,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Search' })).not.toHaveAttribute('aria-current');
  });

  it('sets data-state="active"/"inactive" to match the active prop', () => {
    render(
      <BottomNav>
        <BottomNavItem icon={<span />} label="Home" href="#" active />
        <BottomNavItem icon={<span />} label="Search" href="#" />
      </BottomNav>,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('data-state', 'inactive');
  });

  it('is hidden at the md breakpoint and above', () => {
    render(
      <BottomNav data-testid="bottom-nav">
        <BottomNavItem icon={<span />} label="Home" href="#" />
      </BottomNav>,
    );
    expect(screen.getByTestId('bottom-nav').className).toContain('md:hidden');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <BottomNav>
        <BottomNavItem icon={<span aria-hidden="true" />} label="Home" href="#" active />
        <BottomNavItem icon={<span aria-hidden="true" />} label="Search" href="#" />
      </BottomNav>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
