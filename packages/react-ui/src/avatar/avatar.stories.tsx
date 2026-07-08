import { expect, within } from '@storybook/test';

import { Avatar } from './avatar';
import { AvatarFallback } from './avatar-fallback';
import { AvatarImage } from './avatar-image';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Avatar> = {
  title: 'React UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80" alt="Jane Cooper" />
      <AvatarFallback>JC</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  name: 'Broken image -> fallback',
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken.invalid/no-such-image.jpg" alt="Jane Cooper" />
      <AvatarFallback>JC</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The <img> fails to load in this environment too, so the fallback
    // initials should be the only thing rendered.
    await expect(canvas.findByText('JC')).resolves.toBeInTheDocument();
  },
};

export const NoSrc: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>?</AvatarFallback>
    </Avatar>
  ),
};

export const Shapes: Story = {
  name: 'shape: circle / rounded / square',
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar shape="circle">
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
      <Avatar shape="rounded">
        <AvatarFallback>R</AvatarFallback>
      </Avatar>
      <Avatar shape="square">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
    </div>
  ),
};
