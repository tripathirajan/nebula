import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Spinner } from './spinner';

describe('Spinner (ui)', () => {
  it('renders the styleless behavior unchanged (role="status" + label)', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('applies the token + animation classes', () => {
    render(<Spinner />);
    const status = screen.getByRole('status');
    expect(status.className).toContain('animate-spin');
    expect(status.className).toContain('border-t-[var(--spinner-indicator)]');
  });

  it('lets a consumer override size via className (tailwind-merge resolves the conflict)', () => {
    render(<Spinner className="h-8 w-8 border-4" />);
    const status = screen.getByRole('status');
    expect(status.className).toContain('h-8');
    expect(status.className).toContain('w-8');
    expect(status.className).not.toContain('h-5');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
