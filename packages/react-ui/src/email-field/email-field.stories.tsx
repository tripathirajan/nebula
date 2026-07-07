import { expect, within } from '@storybook/test';

import { EmailField } from './email-field';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/EmailField',
  component: EmailField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof EmailField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'email', placeholder: 'you@example.com', 'aria-label': 'Email' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toHaveAttribute('type', 'email');
  },
};
