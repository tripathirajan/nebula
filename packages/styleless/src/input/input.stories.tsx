import { expect, within } from '@storybook/test';

import { Input } from './input';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'Styleless/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'you@example.com' },
};

export const Invalid: Story = {
  args: { invalid: true, 'aria-describedby': 'email-error' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  },
};
