import { expect, within } from '@storybook/test';

import { Avatar } from '../avatar/avatar';
import { AvatarFallback } from '../avatar/avatar-fallback';

import { AvatarGroup } from './avatar-group';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Styleless/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithOverflow: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar>
        <AvatarFallback>AA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>BB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>DD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>EE</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('AA')).toBeInTheDocument();
    await expect(canvas.getByText('CC')).toBeInTheDocument();
    await expect(canvas.getByText('+2')).toBeInTheDocument();
    expect(canvas.queryByText('DD')).toBeNull();
  },
};
