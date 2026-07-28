import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Link } from './link';

describe('Link (ui)', () => {
  it('renders an anchor with the primary color', () => {
    render(<Link href="/pricing">See pricing</Link>);
    const link = screen.getByRole('link', { name: 'See pricing' });
    expect(link).toHaveAttribute('href', '/pricing');
    expect(link.className).toContain('text-[var(--color-primary)]');
  });

  it('sets target/rel for external links', () => {
    render(
      <Link href="https://example.com" external>
        External docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'External docs' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Link href="/pricing">See pricing</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
