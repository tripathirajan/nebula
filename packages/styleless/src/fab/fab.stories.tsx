import { expect, fn, within } from '@storybook/test';

import { FAB } from './fab';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FAB> = {
  title: 'Styleless/FAB',
  component: FAB,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'aria-label': 'Compose', children: '+' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Compose' })).toBeInTheDocument();
  },
};
