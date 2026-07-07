import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Rating } from './rating';
import { RatingItem } from './rating-item';

function DemoRating(props: React.ComponentProps<typeof Rating>) {
  return (
    <Rating aria-label="Rate this product" {...props}>
      <RatingItem value={1} aria-label="1 star" />
      <RatingItem value={2} aria-label="2 stars" />
      <RatingItem value={3} aria-label="3 stars" />
    </Rating>
  );
}

describe('Rating', () => {
  it('fills every item up to and including the committed value', () => {
    render(<DemoRating defaultValue={2} />);
    expect(screen.getByRole('radio', { name: '1 star' })).toHaveAttribute('data-state', 'filled');
    expect(screen.getByRole('radio', { name: '2 stars' })).toHaveAttribute('data-state', 'filled');
    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('data-state', 'empty');
  });

  it('hovering previews the fill without committing the value', () => {
    render(<DemoRating defaultValue={1} />);
    fireEvent.pointerEnter(screen.getByRole('radio', { name: '3 stars' }));

    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('data-state', 'filled');
    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('aria-checked', 'false');
  });

  it('leaving the group resets the preview back to the committed value', () => {
    const { container } = render(<DemoRating defaultValue={1} />);
    fireEvent.pointerEnter(screen.getByRole('radio', { name: '3 stars' }));
    fireEvent.pointerLeave(container.querySelector('[role="radiogroup"]') as Element);

    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('data-state', 'empty');
    expect(screen.getByRole('radio', { name: '1 star' })).toHaveAttribute('data-state', 'filled');
  });

  it('clicking commits the value', () => {
    const onValueChange = vi.fn();
    render(<DemoRating onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('radio', { name: '3 stars' }));
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('aria-checked', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoRating defaultValue={2} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
