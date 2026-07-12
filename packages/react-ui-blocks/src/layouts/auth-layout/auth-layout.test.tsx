import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { AuthLayout } from './auth-layout';

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

describe('AuthLayout (block)', () => {
  it('renders children inside a centered wrapper', () => {
    render(
      <AuthLayout>
        <div>Sign in form</div>
      </AuthLayout>,
    );
    expect(screen.getByText('Sign in form')).toBeInTheDocument();
  });

  it('always hides the header (no title, no ThemeSwitcher)', () => {
    render(
      <AuthLayout title="Acme">
        <div>Sign in form</div>
      </AuthLayout>,
    );
    expect(screen.queryByText('Acme')).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Theme' })).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <AuthLayout>
        <div>Sign in form</div>
      </AuthLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
