import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DashboardLayout } from './dashboard-layout';

beforeEach(() => {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
});

describe('DashboardLayout (block)', () => {
  it('renders the sidebar and content, and the title in the header', () => {
    render(
      <DashboardLayout title="Acme Admin" sidebar={<nav>Primary nav</nav>}>
        <div>Dashboard content</div>
      </DashboardLayout>,
    );
    expect(screen.getByText('Acme Admin')).toBeInTheDocument();
    expect(screen.getByText('Primary nav')).toBeInTheDocument();
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });

  it('renders the sidebar as a complementary landmark', () => {
    render(
      <DashboardLayout title="Acme Admin" sidebar={<nav>Primary nav</nav>}>
        <div>Dashboard content</div>
      </DashboardLayout>,
    );
    expect(screen.getByRole('complementary')).toHaveTextContent('Primary nav');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DashboardLayout title="Acme Admin" sidebar={<nav>Primary nav</nav>}>
        <div>Dashboard content</div>
      </DashboardLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
