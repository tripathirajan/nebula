import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Progress } from './progress';

describe('Progress (ui)', () => {
  it('renders the styleless behavior unchanged (role + aria-value*)', () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('applies the token classes to the track', () => {
    render(<Progress value={40} />);
    expect(screen.getByRole('progressbar').className).toContain('bg-[var(--progress-track-bg)]');
  });

  it('applies an inline transform to the indicator matching the percentage', () => {
    render(<Progress value={25} max={100} />);
    const indicator = screen.getByRole('progressbar').firstElementChild as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-75%)');
  });

  it('renders a full-width pulsing indicator when indeterminate', () => {
    render(<Progress value={null} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    const indicator = bar.firstElementChild as HTMLElement;
    expect(indicator.className).toContain('animate-pulse');
  });

  it('has no axe violations', async () => {
    // `Progress` has no label sub-component, so — same as any real
    // `role="progressbar"` with no visible caption — an accessible name is
    // on the consumer to supply via `aria-label`/`aria-labelledby`.
    const { container } = render(<Progress value={60} aria-label="Upload progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
