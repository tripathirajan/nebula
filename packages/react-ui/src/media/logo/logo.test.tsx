import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Logo } from './logo';

describe('Logo (ui)', () => {
  it('defaults to a 24x24 svg', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('honors a custom size', () => {
    const { container } = render(<Logo size={48} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });

  it('fills with currentColor, so it follows the surrounding text color (theme-aware, no separate light/dark asset)', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'currentColor');
    // No separate fill on the inner path — it inherits the svg's currentColor.
    expect(container.querySelector('path')).not.toHaveAttribute('fill');
  });

  it('is decorative (aria-hidden) by default — a consumer pairs it with visible text for the accessible name', () => {
    const { container } = render(<Logo />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards the ref to the underlying svg', () => {
    const ref = { current: null as SVGSVGElement | null };
    render(<Logo ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Logo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
