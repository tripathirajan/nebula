import { expect, userEvent, within } from '@storybook/test';

import { Slider } from './slider';
import { SliderRange } from './slider-range';
import { SliderThumb } from './slider-thumb';
import { SliderTrack } from './slider-track';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <Slider defaultValue={[50]} min={0} max={100}>
      <SliderTrack className="relative h-1.5 w-64">
        <SliderRange />
        <SliderThumb index={0} aria-label="Volume" />
      </SliderTrack>
    </Slider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider', { name: 'Volume' });
    await expect(thumb).toHaveAttribute('aria-valuenow', '50');

    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '51');

    await userEvent.keyboard('{End}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '100');

    await userEvent.keyboard('{Home}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '0');
  },
};

export const Range: Story = {
  render: () => (
    <Slider defaultValue={[20, 80]} min={0} max={100}>
      <SliderTrack className="relative h-1.5 w-64">
        <SliderRange />
        <SliderThumb index={0} aria-label="Minimum price" />
        <SliderThumb index={1} aria-label="Maximum price" />
      </SliderTrack>
    </Slider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const min = canvas.getByRole('slider', { name: 'Minimum price' });
    const max = canvas.getByRole('slider', { name: 'Maximum price' });
    await expect(min).toHaveAttribute('aria-valuenow', '20');
    await expect(max).toHaveAttribute('aria-valuenow', '80');
  },
};
