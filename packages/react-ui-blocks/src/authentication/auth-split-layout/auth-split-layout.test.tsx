import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { AuthSplitLayout } from './auth-split-layout';

describe('AuthSplitLayout (block)', () => {
  it('renders children (the form) in the right panel', () => {
    render(
      <AuthSplitLayout>
        <button type="submit">Sign in</button>
      </AuthSplitLayout>,
    );
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the left panel logo/title/description/illustration/footer slots', () => {
    render(
      <AuthSplitLayout
        logo={<span>Acme</span>}
        title="Hi, welcome back"
        description="More effectively with optimized workflows."
        illustration={<span data-testid="illustration" />}
        footerSlot={<span>Trusted by</span>}
      >
        <button type="submit">Sign in</button>
      </AuthSplitLayout>,
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Hi, welcome back' })).toBeInTheDocument();
    expect(screen.getByText('More effectively with optimized workflows.')).toBeInTheDocument();
    expect(screen.getByTestId('illustration')).toBeInTheDocument();
    expect(screen.getByText('Trusted by')).toBeInTheDocument();
  });

  it('renders the top-right slot', () => {
    render(
      <AuthSplitLayout topRightSlot={<a href="/help">Need help?</a>}>
        <button type="submit">Sign in</button>
      </AuthSplitLayout>,
    );
    expect(screen.getByRole('link', { name: 'Need help?' })).toBeInTheDocument();
  });

  it('the left panel is hidden below lg (mobile is full-screen form only)', () => {
    render(
      <AuthSplitLayout title="Hi, welcome back">
        <button type="submit">Sign in</button>
      </AuthSplitLayout>,
    );
    const heading = screen.getByRole('heading', { name: 'Hi, welcome back' });
    // The left panel wrapper carries `hidden lg:flex` — walk up to it.
    const leftPanel = heading.closest('.hidden');
    expect(leftPanel).not.toBeNull();
    expect(leftPanel?.className).toContain('lg:flex');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <AuthSplitLayout title="Hi, welcome back" description="Sign in to continue.">
        <button type="submit">Sign in</button>
      </AuthSplitLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
