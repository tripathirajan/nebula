import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { PromoBannerCarousel } from './promo-banner-carousel';

import type { PromoBannerProps } from './promo-banner';

const banners: PromoBannerProps[] = [
  { headline: 'Premium plans, up to 50% off', color: 'info' },
  { headline: 'Free shipping this week', color: 'success' },
  { headline: 'New arrivals just dropped', color: 'accent' },
];

function swipe(element: Element, deltaX: number) {
  fireEvent.pointerDown(element, { pointerId: 1, clientX: 0, clientY: 0 });
  fireEvent.pointerMove(element, { pointerId: 1, clientX: deltaX, clientY: 0 });
  fireEvent.pointerUp(element, { pointerId: 1, clientX: deltaX, clientY: 0 });
}

describe('PromoBannerCarousel (block)', () => {
  it('shows only the first banner on screen initially, no nav buttons rendered', () => {
    render(<PromoBannerCarousel banners={banners} />);
    expect(screen.getByRole('heading', { name: 'Premium plans, up to 50% off' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next slide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Previous slide' })).not.toBeInTheDocument();
  });

  it('advances to the next banner on a leftward swipe', () => {
    render(<PromoBannerCarousel banners={banners} />);
    const active = screen
      .getByRole('heading', { name: 'Premium plans, up to 50% off' })
      .closest('[role="group"]')!;
    swipe(active, -80);
    expect(screen.getByRole('heading', { name: 'Free shipping this week' }).closest('[role="group"]')).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  it('advances to the next banner on a horizontal wheel gesture', () => {
    render(<PromoBannerCarousel banners={banners} />);
    const content = screen
      .getByRole('heading', { name: 'Premium plans, up to 50% off' })
      .closest('[role="region"] > div')!;
    fireEvent.wheel(content, { deltaX: 40, deltaY: 0 });
    expect(screen.getByRole('heading', { name: 'Free shipping this week' }).closest('[role="group"]')).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  it('jumps to a banner via the dot indicators', () => {
    render(<PromoBannerCarousel banners={banners} />);
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
    fireEvent.click(dots[2]!);
    expect(screen.getByRole('heading', { name: 'New arrivals just dropped' }).closest('[role="group"]')).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  it('wraps past the last banner by default (loop)', () => {
    render(<PromoBannerCarousel banners={banners} defaultIndex={2} />);
    const active = screen
      .getByRole('heading', { name: 'New arrivals just dropped' })
      .closest('[role="group"]')!;
    swipe(active, -80);
    expect(screen.getByRole('heading', { name: 'Premium plans, up to 50% off' }).closest('[role="group"]')).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  it('supports a controlled index', () => {
    const onIndexChange = vi.fn();
    render(<PromoBannerCarousel banners={banners} index={0} onIndexChange={onIndexChange} />);
    const active = screen
      .getByRole('heading', { name: 'Premium plans, up to 50% off' })
      .closest('[role="group"]')!;
    swipe(active, -80);
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('heading', { name: 'Premium plans, up to 50% off' }).closest('[role="group"]')).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<PromoBannerCarousel banners={banners} aria-label="Promotions" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
