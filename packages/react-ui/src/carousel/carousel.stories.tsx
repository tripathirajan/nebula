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
