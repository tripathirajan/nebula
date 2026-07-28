import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { SideNavItem } from './side-nav-item';

// Same router-`Link` stand-in `BottomNavItem`'s own test file uses — see
// that file's comment for why `children` is spread but never passed.
const LinkStub = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'> & { to: string }>(
  ({ to, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content -- content comes from SideNavItem's Slottable-merged label, not from this stub
    <a href={to} ref={ref} {...props} />
  ),
);
LinkStub.displayName = 'LinkStub';

describe('SideNavItem (ui)', () => {
  it('renders icon + label as a plain anchor by default', () => {
    render(<SideNavItem icon={<span data-testid="icon" />} label="Home" href="/" />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not crash with asChild + a childless slotted element (same SlotClone regression BottomNavItem guards)', () => {
    expect(() =>
      render(
        <SideNavItem icon={<span data-testid="icon" />} label="Search" asChild>
          <LinkStub to="/search" />
        </SideNavItem>,
      ),
    ).not.toThrow();
  });

  it('carries active/aria-current/data-state through', () => {
    render(<SideNavItem icon={<span />} label="Search" active href="/search" />);
    const link = screen.getByRole('link', { name: 'Search' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('data-state', 'active');
  });

  it('label stays in the accessible name and reachable by text when collapsed (visually hidden, not unmounted)', () => {
    render(<SideNavItem icon={<span />} label="Home" collapsed href="/" />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toBeInTheDocument();
    const label = screen.getByText('Home');
    expect(label.className).toContain('sr-only');
  });

  it('label is not visually hidden when not collapsed', () => {
    render(<SideNavItem icon={<span />} label="Home" href="/" />);
    expect(screen.getByText('Home').className).not.toContain('sr-only');
  });

  it('forwards the ref to the underlying <a>', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<SideNavItem icon={<span />} label="Search" href="/search" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
