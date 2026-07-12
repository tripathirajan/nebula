import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { AppLayout } from './app-layout';

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

describe('AppLayout (block)', () => {
  it('renders the title and children inside a main landmark', () => {
    render(
      <AppLayout title="Acme">
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Content');
  });

  it('renders the ThemeSwitcher by default', () => {
    render(
      <AppLayout title="Acme">
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
  });

  it('omits the header entirely when hideHeader is set', () => {
    render(
      <AppLayout title="Acme" hideHeader>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.queryByText('Acme')).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Theme' })).not.toBeInTheDocument();
  });

  it('renders the portal-root div', () => {
    const { container } = render(
      <AppLayout title="Acme">
        <div>Content</div>
      </AppLayout>,
    );
    expect(container.querySelector('#nebula-portal-root')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <AppLayout title="Acme">
        <div>Content</div>
      </AppLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
