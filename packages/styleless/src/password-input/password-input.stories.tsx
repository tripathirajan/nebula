import { expect, userEvent, within } from '@storybook/test';

import { PasswordInput } from './password-input';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PasswordInput> = {
  title: 'Styleless/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'password', placeholder: 'Password' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Password');
    await expect(input).toHaveAttribute('type', 'password');

    const toggle = canvas.getByRole('button', { name: 'Show password' });
    await userEvent.click(toggle);
    await expect(input).toHaveAttribute('type', 'text');
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  },
};
