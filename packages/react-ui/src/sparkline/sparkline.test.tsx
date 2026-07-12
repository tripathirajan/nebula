import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Sparkline } from './sparkline';

describe('Sparkline (ui)', () => {
  it('plots one point per data value, spanning the viewBox width', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    const polyline = container.querySelector('polyline');
    const points = polyline?.getAttribute('points')?.split(' ') ?? [];
    expect(points).toHaveLength(3);
    expect(points[0]?.startsWith('0,')).toBe(true);
    expect(points[2]?.startsWith('100,')).toBe(true);
  });

  it('plots a higher value at a lower y (SVG grows downward)', () => {
    const { container } = render(<Sparkline data={[0, 10]} />);
    const points = container.querySelector('polyline')?.getAttribute('points')?.split(' ') ?? [];
    const [, firstY] = points[0]?.split(',').map(Number) ?? [];
    const [, secondY] = points[1]?.split(',').map(Number) ?? [];
    expect(secondY).toBeLessThan(firstY as number);
  });

  it('plots a single point at vertical center instead of dividing by zero', () => {
    const { container } = render(<Sparkline data={[5]} />);
    const points = container.querySelector('polyline')?.getAttribute('points')?.split(' ') ?? [];
    expect(points).toEqual(['0,16']);
  });

  it('plots flat (all-equal) data as a level line, not NaN', () => {
    const { container } = render(<Sparkline data={[5, 5, 5]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline?.getAttribute('points')).not.toContain('NaN');
  });

  it('renders nothing plottable for empty data', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.querySelector('polyline')).not.toBeInTheDocument();
  });

  it('only renders the area fill under the "area" variant', () => {
    const { container: line } = render(<Sparkline data={[1, 2, 3]} />);
    expect(line.querySelector('polygon')).not.toBeInTheDocument();

    const { container: area } = render(<Sparkline data={[1, 2, 3]} variant="area" />);
    expect(area.querySelector('polygon')).toBeInTheDocument();
  });

  it('is aria-hidden by default (restates a trend a Stat/badge already states in text)', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
