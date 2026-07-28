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

  it('sets --backdrop-tint to the real color token via style, not embedded in the class string', () => {
    // Regression test: a class built as `` `bg-[${bgVar}]/50` `` never
    // appears as literal text anywhere in the source, so Tailwind's JIT
    // scanner can't see it and never generates a CSS rule for it — the
    // backdrop rendered fully transparent in a real build despite the
    // class being present in the DOM. Asserting on the *style* (where the
    // real token now lives) instead of the class string is what actually
    // catches that class of bug.
    render(<Backdrop data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.style.getPropertyValue('--backdrop-tint')).toBe('var(--backdrop-bg)');
  });

  it('defaults to the solid variant using a static, literal color-mix class', () => {
    render(<Backdrop data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('bg-[color-mix(in_oklch,var(--backdrop-tint)_50%,transparent)]');
    expect(backdrop.className).not.toContain('backdrop-blur');
  });

  it('applies a real frosted-glass treatment for variant="blur" — blur plus saturation, not just a blurred tint', () => {
    render(<Backdrop variant="blur" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('backdrop-blur-xl');
    expect(backdrop.className).toContain('backdrop-saturate-150');
    expect(backdrop.className).toContain('bg-[color-mix(in_oklch,var(--backdrop-tint)_20%,transparent)]');
  });

  it('defaults blurIntensity to "regular" — unchanged from before the prop existed', () => {
    render(<Backdrop variant="blur" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('backdrop-blur-xl');
    expect(backdrop.className).toContain('backdrop-saturate-150');
    expect(backdrop.className).toContain('bg-[color-mix(in_oklch,var(--backdrop-tint)_20%,transparent)]');
  });

  it('applies a lighter treatment for blurIntensity="subtle"', () => {
    render(<Backdrop variant="blur" blurIntensity="subtle" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('backdrop-blur-md');
    expect(backdrop.className).toContain('backdrop-saturate-125');
    expect(backdrop.className).toContain('bg-[color-mix(in_oklch,var(--backdrop-tint)_25%,transparent)]');
  });

  it('applies a heavier treatment for blurIntensity="strong"', () => {
    render(<Backdrop variant="blur" blurIntensity="strong" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('backdrop-blur-2xl');
    expect(backdrop.className).toContain('backdrop-saturate-[2]');
    expect(backdrop.className).toContain('bg-[color-mix(in_oklch,var(--backdrop-tint)_15%,transparent)]');
  });

  it('ignores blurIntensity when variant="solid"', () => {
    render(<Backdrop blurIntensity="strong" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).not.toContain('backdrop-blur');
    expect(backdrop.className).toContain('bg-[color-mix(in_oklch,var(--backdrop-tint)_50%,transparent)]');
  });

  it('accepts a custom className without losing the base positioning', () => {
    render(<Backdrop className="custom-class" data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.className).toContain('custom-class');
    expect(backdrop.className).toContain('fixed');
  });

  it('merges a custom style without losing --backdrop-tint', () => {
    render(<Backdrop style={{ opacity: 0.9 }} data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop.style.opacity).toBe('0.9');
    expect(backdrop.style.getPropertyValue('--backdrop-tint')).toBe('var(--backdrop-bg)');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Backdrop />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
