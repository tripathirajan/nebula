import { expect, within } from '@storybook/test';

import { EmailInput } from './email-input';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof EmailInput> = {
  title: 'Styleless/EmailInput',
  component: EmailInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'email', placeholder: 'you@example.com' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByPlaceholderText('you@example.com')).toHaveAttribute('type', 'email');
  },
};
