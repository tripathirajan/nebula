import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('is aria-hidden by default', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('allows overriding aria-hidden', () => {
    render(<Skeleton data-testid="skeleton" aria-hidden={false} aria-label="Loading name" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-hidden', 'false');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading name');
  });

  it('forwards className and style for react-ui to style off of', () => {
    render(<Skeleton data-testid="skeleton" className="rounded-full" style={{ width: 40 }} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('rounded-full');
    expect(skeleton).toHaveStyle({ width: '40px' });
  });

  it('is invisible to accessible-name queries when grouped under a single status region', () => {
    render(
      <div role="status" aria-label="Loading profile">
        <Skeleton />
        <Skeleton />
      </div>,
    );
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });
});
