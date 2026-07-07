import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Breadcrumb } from './breadcrumb';
import { BreadcrumbItem } from './breadcrumb-item';
import { BreadcrumbLink } from './breadcrumb-link';
import { BreadcrumbList } from './breadcrumb-list';
import { BreadcrumbPage } from './breadcrumb-page';
import { BreadcrumbSeparator } from './breadcrumb-separator';

function DemoBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe('Breadcrumb', () => {
  it('renders a nav landmark labelled "breadcrumb" by default', () => {
    render(<DemoBreadcrumb />);
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
  });

  it('allows overriding the aria-label', () => {
    render(
      <Breadcrumb aria-label="You are here">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument();
  });

  it('renders an ordered list of items', () => {
    render(<DemoBreadcrumb />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
  });

  it('renders links for ancestor pages', () => {
    render(<DemoBreadcrumb />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');
  });

  it('marks the current page with aria-current="page" and aria-disabled', () => {
    render(<DemoBreadcrumb />);
    const page = screen.getByText('Profile');
    expect(page).toHaveAttribute('aria-current', 'page');
    expect(page).toHaveAttribute('aria-disabled', 'true');
    expect(page.tagName).toBe('SPAN');
  });

  it('marks separators as presentational/aria-hidden', () => {
    const { container } = render(<DemoBreadcrumb />);
    const separators = container.querySelectorAll('[role="presentation"]');
    expect(separators).toHaveLength(2);
    separators.forEach((separator) => {
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoBreadcrumb />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
