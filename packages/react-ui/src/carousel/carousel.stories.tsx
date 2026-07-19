import { expect, userEvent, within } from '@storybook/test';

import { Carousel } from './carousel';
import { CarouselContent } from './carousel-content';
import { CarouselIndicators } from './carousel-indicators';
import { CarouselItem } from './carousel-item';
import { CarouselNext } from './carousel-next';
import { CarouselPrevious } from './carousel-previous';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Carousel> = {
  title: 'React UI/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 600-shade Tailwind colors, not the lighter 400-shades — white slide text
// needs roughly a 4.5:1 contrast ratio to pass WCAG AA, which the lighter
// shades (particularly yellow) don't reliably clear.
const slides = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb'];

function Slide({ color, index }: { color: string; index: number }) {
  return (
    <div
      style={{ backgroundColor: color }}
      className="flex h-64 w-full items-center justify-center text-2xl font-semibold text-white"
    >
      Slide {index + 1}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Carousel count={slides.length} aria-label="Color slides">
        <CarouselContent>
          {slides.map((color, index) => (
            <CarouselItem key={color} index={index}>
              <Slide color={color} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselIndicators />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Slide 1')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
    await expect(canvas.getByRole('tab', { name: 'Go to slide 2' })).toHaveAttribute('aria-selected', 'true');
  },
};

export const Looping: Story = {
  name: 'Looping (wraps at the bounds)',
  render: () => (
    <div style={{ width: 480 }}>
      <Carousel count={slides.length} loop aria-label="Color slides, looping">
        <CarouselContent>
          {slides.map((color, index) => (
            <CarouselItem key={color} index={index}>
              <Slide color={color} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselIndicators />
      </Carousel>
    </div>
  ),
};

export const AutoSwipe: Story = {
  name: 'Auto-swiping (paused by a manual swipe, resumes after)',
  render: () => (
    <div style={{ width: 480 }}>
      <Carousel count={slides.length} loop autoSwipeInterval={2000} aria-label="Color slides, auto-swiping">
        <CarouselContent>
          {slides.map((color, index) => (
            <CarouselItem key={color} index={index}>
              <Slide color={color} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselIndicators />
      </Carousel>
    </div>
  ),
};

/**
 * A "hero replacement" section (category filter row + full-bleed swipeable
 * banner underneath, no arrow buttons) built entirely from `Carousel`'s
 * existing parts — the whole point being that neither `Carousel` nor
 * `CarouselContent` has any visual opinion of its own (no rounded corners,
 * no color, no forced padding baked in), so completely arbitrary banner
 * markup drops straight in. `CarouselIndicators overlay={false}` sits in
 * its own row below the card instead of floating over it.
 */
function CategoryTabs() {
  const categories = ['For You', 'Fashion', 'Mobiles', 'Electronics', 'Beauty'];
  return (
    <div className="flex gap-6 border-b border-[var(--color-base-300)] px-4">
      {categories.map((category, i) => (
        <button
          key={category}
          type="button"
          className={
            i === 0
              ? 'border-b-2 border-[var(--color-primary)] py-3 text-sm font-medium text-[var(--color-primary)]'
              : 'py-3 text-sm text-[var(--color-base-content)]/70'
          }
        >
          {category}
        </button>
      ))}
    </div>
  );
}

const banners = [
  { title: 'P6L 4K Smart TV', subtitle: 'From $295, big screen sport starts here', fill: '#0f172a' },
  { title: 'Wireless earbuds', subtitle: 'Up to 60% off, today only', fill: '#1e3a8a' },
  { title: 'Home essentials', subtitle: 'New season, new looks', fill: '#3f2d1c' },
];

function BannerSlide({ banner }: { banner: (typeof banners)[number] }) {
  return (
    <div
      className="flex h-full w-full flex-col justify-end rounded-2xl p-5 text-white"
      style={{ background: banner.fill }}
    >
      <p className="text-lg font-semibold">{banner.title}</p>
      <p className="text-sm text-white/80">{banner.subtitle}</p>
    </div>
  );
}

export const FlipkartStyleSection: Story = {
  name: 'Category bar + auto-swiping banner (Flipkart-style)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="mx-auto max-w-sm bg-[var(--color-base-100)]">
      <CategoryTabs />
      <div className="flex flex-col gap-3 p-4">
        <Carousel count={banners.length} loop autoSwipeInterval={3000} aria-label="Promotions">
          {/* The aspect ratio lives on `CarouselContent`, not `Carousel`'s
              root, specifically so `CarouselIndicators` below can sit in
              normal document flow underneath it — if the root itself were
              the fixed-height box, the indicators would have nowhere to go
              but overlapping inside that same height. */}
          <CarouselContent className="aspect-[1.8/1] w-full">
            {banners.map((banner, index) => (
              <CarouselItem key={banner.title} index={index} className="h-full">
                <BannerSlide banner={banner} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselIndicators overlay={false} />
        </Carousel>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('P6L 4K Smart TV')).toBeInTheDocument();

    const dots = canvas.getAllByRole('tab');
    expect(dots).toHaveLength(3);
    // Indicators sit in normal flow below the card, not absolutely
    // positioned over it, per this story's whole point.
    expect(dots[0]!.closest('[role="tablist"]')!.className).not.toContain('absolute');
  },
};

export const Vertical: Story = {
  render: () => (
    <div style={{ width: 320, height: 300 }}>
      <Carousel count={slides.length} orientation="vertical" aria-label="Color slides, vertical">
        <CarouselContent className="h-full">
          {slides.map((color, index) => (
            <CarouselItem key={color} index={index} className="h-full">
              <Slide color={color} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselIndicators />
      </Carousel>
    </div>
  ),
};
