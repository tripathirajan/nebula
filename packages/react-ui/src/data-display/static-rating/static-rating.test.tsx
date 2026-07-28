import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { StaticRating } from './static-rating';

describe('StaticRating', () => {
  it('renders as a single img-role node with a descriptive label', () => {
    render(<StaticRating value={4.5} />);
    const rating = screen.getByRole('img', { name: '4.5 out of 5 stars' });
    expect(rating).toBeInTheDocument();
  });

  it('rounds to the nearest whole star for the filled count', () => {
    render(<StaticRating value={3.6} />);
    expect(screen.getByRole('img', { name: '3.6 out of 5 stars' })).toBeInTheDocument();
  });

  it('is not exposed as five separately-focusable controls', () => {
    render(<StaticRating value={5} />);
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('has no axe violations', async () => {
    const { container } = render(<StaticRating value={4} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
