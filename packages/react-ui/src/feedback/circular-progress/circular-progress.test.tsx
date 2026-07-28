import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { CircularProgress } from './circular-progress';

describe('CircularProgress (ui)', () => {
  it('renders the headless behavior unchanged (role + aria-value*)', () => {
    render(<CircularProgress value={60} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '60');
  });

  it('applies the primary color stroke by default', () => {
    render(<CircularProgress value={60} />);
    const track = screen.getByRole('progressbar').querySelector('circle');
    expect(track?.getAttribute('class')).toContain('stroke-[var(--progress-primary-track-bg)]');
  });

  it('applies the requested color', () => {
    render(<CircularProgress value={60} color="danger" />);
    const track = screen.getByRole('progressbar').querySelector('circle');
    expect(track?.getAttribute('class')).toContain('stroke-[var(--progress-danger-track-bg)]');
  });

  it('spins the whole ring when indeterminate', () => {
    render(<CircularProgress value={null} />);
    expect(screen.getByRole('progressbar').className).toContain('animate-spin');
  });

  it('has no axe violations', async () => {
    const { container } = render(<CircularProgress value={60} aria-label="Upload progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
