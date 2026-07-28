import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Carousel } from './carousel';
import { CarouselContent } from './carousel-content';
import { CarouselIndicators } from './carousel-indicators';
import { CarouselItem } from './carousel-item';
import { CarouselNext } from './carousel-next';
import { CarouselPrevious } from './carousel-previous';

function DemoCarousel(props: {
  count?: number;
  loop?: boolean;
  index?: number;
  onIndexChange?: (index: number) => void;
  autoSwipeInterval?: number;
}) {
  const { count = 3, loop, index, onIndexChange, autoSwipeInterval } = props;
  return (
    <Carousel
      count={count}
      loop={loop}
      index={index}
      onIndexChange={onIndexChange}
      autoSwipeInterval={autoSwipeInterval}
      aria-label="Featured products"
    >
      <CarouselContent>
        {Array.from({ length: count }, (_, i) => (
          <CarouselItem key={i} index={i}>
            Slide {i + 1}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselIndicators />
    </Carousel>
  );
}

describe('Carousel', () => {
  it('renders the WAI-ARIA carousel region', () => {
    render(<DemoCarousel />);
    const region = screen.getByRole('region', { name: 'Featured products' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('marks only the active slide as visible, the rest aria-hidden', () => {
    render(<DemoCarousel />);
    expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByText('Slide 2').closest('[role="group"]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('CarouselNext advances the index and is disabled at the last slide without loop', async () => {
    const user = userEvent.setup();
    render(<DemoCarousel count={2} />);
    const next = screen.getByRole('button', { name: 'Next slide' });

    expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
    await user.click(next);
    expect(screen.getByText('Slide 2').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
    expect(next).toBeDisabled();
  });

  it('CarouselPrevious is disabled at the first slide without loop', () => {
    render(<DemoCarousel />);
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
  });

  it('advances on a horizontal-dominant wheel gesture but ignores a vertical one', () => {
    render(<DemoCarousel count={3} />);
    const content = screen.getByText('Slide 1').closest('[role="region"] > div')!;

    fireEvent.wheel(content, { deltaX: 0, deltaY: 80 });
    expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('data-state', 'active');

    fireEvent.wheel(content, { deltaX: 40, deltaY: 0 });
    expect(screen.getByText('Slide 2').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('wraps past the bounds when loop is set', async () => {
    const user = userEvent.setup();
    render(<DemoCarousel count={2} loop />);
    const previous = screen.getByRole('button', { name: 'Previous slide' });

    expect(previous).not.toBeDisabled();
    await user.click(previous);
    expect(screen.getByText('Slide 2').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('CarouselIndicators jumps to the clicked slide and reflects aria-selected', async () => {
    const user = userEvent.setup();
    render(<DemoCarousel count={3} />);
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');

    await user.click(dots[2]!);
    expect(screen.getByText('Slide 3').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
    expect(dots[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('supports a controlled index', async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<DemoCarousel count={3} index={0} onIndexChange={onIndexChange} />);

    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    // Controlled: the slide shouldn't advance on its own without the index prop updating.
    expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoCarousel />);
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('autoSwipeInterval', () => {
    it('advances automatically once the interval elapses', () => {
      vi.useFakeTimers();
      render(<DemoCarousel count={3} autoSwipeInterval={1000} />);
      expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('data-state', 'active');

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText('Slide 2').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
      vi.useRealTimers();
    });

    it('stops at the last slide without looping, rather than wrapping on its own', () => {
      vi.useFakeTimers();
      render(<DemoCarousel count={2} autoSwipeInterval={1000} />);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText('Slide 2').closest('[role="group"]')).toHaveAttribute('data-state', 'active');

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByText('Slide 2').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
      vi.useRealTimers();
    });

    it('loops back to the first slide when loop is set', () => {
      vi.useFakeTimers();
      render(<DemoCarousel count={2} loop autoSwipeInterval={1000} />);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText('Slide 2').closest('[role="group"]')).toHaveAttribute('data-state', 'active');

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
      vi.useRealTimers();
    });

    it('resets the countdown after a manual interaction instead of firing immediately after', () => {
      vi.useFakeTimers();
      render(<DemoCarousel count={3} loop autoSwipeInterval={1000} />);

      act(() => {
        vi.advanceTimersByTime(600);
      });
      const dots = screen.getAllByRole('tab');
      fireEvent.click(dots[2]!);
      expect(screen.getByText('Slide 3').closest('[role="group"]')).toHaveAttribute('data-state', 'active');

      // Only 400ms left of what would've been the original countdown —
      // shouldn't have advanced yet, since the manual jump reset the timer.
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(screen.getByText('Slide 3').closest('[role="group"]')).toHaveAttribute('data-state', 'active');

      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('data-state', 'active');
      vi.useRealTimers();
    });

    it('is disabled entirely under prefers-reduced-motion', () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList;

      vi.useFakeTimers();
      render(<DemoCarousel count={3} autoSwipeInterval={1000} />);
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByText('Slide 1').closest('[role="group"]')).toHaveAttribute('data-state', 'active');

      vi.useRealTimers();
      window.matchMedia = originalMatchMedia;
    });
  });

  describe('CarouselIndicators overlay', () => {
    it('is absolutely positioned by default', () => {
      render(<DemoCarousel count={3} />);
      const dots = screen.getAllByRole('tab')[0]!.closest('[role="tablist"]')!;
      expect(dots.className).toContain('absolute');
    });

    it('renders in normal document flow when overlay={false}', () => {
      render(
        <Carousel count={3} aria-label="Featured products">
          <CarouselContent>
            {[0, 1, 2].map((i) => (
              <CarouselItem key={i} index={i}>
                Slide {i + 1}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselIndicators overlay={false} />
        </Carousel>,
      );
      const dots = screen.getAllByRole('tab')[0]!.closest('[role="tablist"]')!;
      expect(dots.className).not.toContain('absolute');
    });
  });
});
