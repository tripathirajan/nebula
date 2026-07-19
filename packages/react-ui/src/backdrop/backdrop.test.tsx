import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Backdrop } from './backdrop';

describe('Backdrop', () => {
  it('renders a fixed, full-viewport, aria-hidden layer', () => {
    render(<Backdrop data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop.className).toContain('fixed');
    expect(backdrop.className).toContain('inset-0');
  });

  it('defaults to the solid variant', () => {
    render(<Backdrop data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('bg-[var(--backdrop-bg)]/50');
    expect(backdrop.className).not.toContain('backdrop-blur');
  });

  it('applies a real frosted-glass treatment for variant="blur" — blur plus saturation, not just a blurred tint', () => {
    render(<Backdrop variant="blur" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('backdrop-blur-xl');
    expect(backdrop.className).toContain('backdrop-saturate-150');
    expect(backdrop.className).toContain('bg-[var(--backdrop-bg)]/20');
  });

  it('defaults blurIntensity to "regular" — unchanged from before the prop existed', () => {
    render(<Backdrop variant="blur" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('backdrop-blur-xl');
    expect(backdrop.className).toContain('backdrop-saturate-150');
    expect(backdrop.className).toContain('bg-[var(--backdrop-bg)]/20');
  });

  it('applies a lighter treatment for blurIntensity="subtle"', () => {
    render(<Backdrop variant="blur" blurIntensity="subtle" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('backdrop-blur-md');
    expect(backdrop.className).toContain('backdrop-saturate-125');
    expect(backdrop.className).toContain('bg-[var(--backdrop-bg)]/25');
  });

  it('applies a heavier treatment for blurIntensity="strong"', () => {
    render(<Backdrop variant="blur" blurIntensity="strong" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('backdrop-blur-2xl');
    expect(backdrop.className).toContain('backdrop-saturate-[2]');
    expect(backdrop.className).toContain('bg-[var(--backdrop-bg)]/15');
  });

  it('ignores blurIntensity when variant="solid"', () => {
    render(<Backdrop blurIntensity="strong" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).not.toContain('backdrop-blur');
    expect(backdrop.className).toContain('bg-[var(--backdrop-bg)]/50');
  });

  it('accepts a custom className without losing the base positioning', () => {
    render(<Backdrop className="custom-class" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('custom-class');
    expect(backdrop.className).toContain('fixed');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Backdrop />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
