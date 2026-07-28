import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { BottomNavItem } from './bottom-nav-item';

// Stands in for a router `Link` (e.g. react-router's) without adding a
// router dependency to this package — same shape that matters here:
// forwards `ref`, renders a real `<a>`, accepts arbitrary props. Deliberately
// rendered with no `children` at every call site below (per BottomNavItem's
// own updated doc comment on why), so its accessible content always comes
// from `label` via `Slottable` — that's also why `children` is spread rather
// than omitted here: `eslint-disable-next-line` documents that this stub
// intentionally supports children even though this file never passes any.
const LinkStub = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'> & { to: string }>(
  ({ to, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content -- content comes from BottomNavItem's Slottable-merged label, not from this stub
    <a href={to} ref={ref} {...props} />
  ),
);
LinkStub.displayName = 'LinkStub';

describe('BottomNavItem (ui)', () => {
  it('renders icon + label as a plain anchor by default', () => {
    render(<BottomNavItem icon={<span data-testid="icon" />} label="Home" href="/" />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  // The exact regression: BottomNavItem always rendered two <span> children
  // regardless of `asChild`, which crashes `Slot` (it requires exactly one
  // child) — this combination previously threw "An error occurred in the
  // `<SlotClone>` component" instead of rendering anything.
  it('does not crash with asChild + a childless slotted element (the SlotClone regression)', () => {
    expect(() =>
      render(
        <BottomNavItem icon={<span data-testid="icon" />} label="Search" asChild>
          <LinkStub to="/search" />
        </BottomNavItem>,
      ),
    ).not.toThrow();
  });

  it('merges onto the slotted child — renders one <a>, not a nested/duplicated element', () => {
    render(
      <BottomNavItem icon={<span data-testid="icon" />} label="Search" asChild>
        <LinkStub to="/search" />
      </BottomNavItem>,
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    const [link] = links;
    expect(link).toBeDefined();
    expect(link?.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/search');
  });

  it('still renders icon + label content when using asChild', () => {
    render(
      <BottomNavItem icon={<span data-testid="icon" />} label="Search" asChild>
        <LinkStub to="/search" />
      </BottomNavItem>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('carries active/aria-current/data-state through onto the slotted child', () => {
    render(
      <BottomNavItem icon={<span />} label="Search" active asChild>
        <LinkStub to="/search" />
      </BottomNavItem>,
    );
    const link = screen.getByRole('link', { name: 'Search' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('data-state', 'active');
  });

  it('forwards the ref to the underlying slotted <a>', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <BottomNavItem icon={<span />} label="Search" asChild ref={ref}>
        <LinkStub to="/search" />
      </BottomNavItem>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current?.getAttribute('href')).toBe('/search');
  });
});
