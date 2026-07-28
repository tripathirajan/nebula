import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Skeleton } from './skeleton';

describe('Skeleton (ui)', () => {
  it('renders the headless behavior unchanged (aria-hidden by default)', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the token + animation classes', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.className).toContain('animate-pulse');
    expect(skeleton.className).toContain('bg-[var(--skeleton-bg)]');
  });

  it('lets a consumer override shape via className (tailwind-merge resolves the conflict)', () => {
    render(<Skeleton data-testid="skeleton" className="h-12 w-12 rounded-full" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.className).toContain('rounded-full');
    expect(skeleton.className).not.toContain('rounded-[var(--radius-box)]');
  });

  it('has no axe violations when grouped under one status region', async () => {
    const { container } = render(
      <div role="status" aria-label="Loading profile">
        <Skeleton />
        <Skeleton />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
