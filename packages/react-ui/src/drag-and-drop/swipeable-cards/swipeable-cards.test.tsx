import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SwipeableCards } from './swipeable-cards';

const cards = [
  { id: 'a', label: 'Card A' },
  { id: 'b', label: 'Card B' },
  { id: 'c', label: 'Card C' },
];

function DemoSwipeableCards(props: {
  loop?: boolean;
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
}) {
  const { loop, defaultIndex, index, onIndexChange } = props;
  return (
    <SwipeableCards
      items={cards}
      getItemId={(card) => card.id}
      loop={loop}
      defaultIndex={defaultIndex}
      index={index}
      onIndexChange={onIndexChange}
      renderCard={(card) => <div>{card.label}</div>}
      aria-label="My cards"
      className="h-48 w-80"
    />
  );
}

function swipe(element: Element, deltaX: number) {
  fireEvent.pointerDown(element, { pointerId: 1, clientX: 0, clientY: 0 });
  fireEvent.pointerMove(element, { pointerId: 1, clientX: deltaX, clientY: 0 });
  fireEvent.pointerUp(element, { pointerId: 1, clientX: deltaX, clientY: 0 });
}

describe('SwipeableCards', () => {
  it('renders the WAI-ARIA card-stack region with only the front card interactive', () => {
    render(<DemoSwipeableCards />);
    const region = screen.getByRole('region', { name: 'My cards' });
    expect(region).toHaveAttribute('aria-roledescription', 'card stack');

    expect(screen.getByText('Card A').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('Card B').closest('[role="group"]')).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByText('Card B').closest('[role="group"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('advances to the next card on a leftward swipe past the threshold', () => {
    render(<DemoSwipeableCards />);
    const front = screen.getByText('Card A').closest('[role="group"]')!;
    swipe(front, -120);
    expect(screen.getByText('Card B').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('goes to the previous card on a rightward swipe past the threshold', () => {
    render(<DemoSwipeableCards defaultIndex={1} />);
    const front = screen.getByText('Card B').closest('[role="group"]')!;
    swipe(front, 120);
    expect(screen.getByText('Card A').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('does not advance past the last card when loop is not set', () => {
    render(<DemoSwipeableCards defaultIndex={2} />);
    const front = screen.getByText('Card C').closest('[role="group"]')!;
    swipe(front, -120);
    expect(screen.getByText('Card C').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('wraps to the first card past the last one when loop is set', () => {
    render(<DemoSwipeableCards defaultIndex={2} loop />);
    const front = screen.getByText('Card C').closest('[role="group"]')!;
    swipe(front, -120);
    expect(screen.getByText('Card A').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('does not commit a swipe under the drag threshold', () => {
    render(<DemoSwipeableCards />);
    const front = screen.getByText('Card A').closest('[role="group"]')!;
    swipe(front, -20);
    expect(screen.getByText('Card A').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('supports a controlled index', () => {
    const onIndexChange = vi.fn();
    render(<DemoSwipeableCards index={0} onIndexChange={onIndexChange} />);
    const front = screen.getByText('Card A').closest('[role="group"]')!;
    swipe(front, -120);
    expect(onIndexChange).toHaveBeenCalledWith(1);
    // Controlled: the front card shouldn't change on its own without the index prop updating.
    expect(screen.getByText('Card A').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoSwipeableCards />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
