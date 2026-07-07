import { expect, waitFor, within } from '@storybook/test';

import { Avatar } from './avatar';
import { AvatarFallback } from './avatar-fallback';
import { AvatarImage } from './avatar-image';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Avatar> = {
  title: 'Styleless/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=1" alt="Jane Cooper" />
      <AvatarFallback>JC</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByAltText('Jane Cooper')).toBeInTheDocument());
  },
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="No image" />
      <AvatarFallback>NA</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('NA')).toBeInTheDocument());
  },
};
