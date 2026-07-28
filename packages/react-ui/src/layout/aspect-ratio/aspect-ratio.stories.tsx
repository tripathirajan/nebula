import { AspectRatio } from './aspect-ratio';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AspectRatio> = {
  title: 'React UI/Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Widescreen: Story = {
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={16 / 9} className="rounded-[var(--radius-selector)] bg-[var(--color-base-200)]" />
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-40">
      <AspectRatio ratio={1} className="rounded-[var(--radius-selector)] bg-[var(--color-base-200)]" />
    </div>
  ),
};
