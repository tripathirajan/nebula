import { expect, fn, within } from '@storybook/test';

import { IconButton } from './icon-button';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof IconButton> = {
  title: 'Styleless/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'aria-label': 'Settings', children: '⚙' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: { 'aria-label': 'Settings', children: '⚙', loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Settings' });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  },
};
