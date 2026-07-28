import { expect, userEvent, within } from '@storybook/test';

import { PasswordField } from './password-field';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'password', placeholder: 'Password', 'aria-label': 'Password' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password');
    await expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(input).toHaveAttribute('type', 'text');
  },
};
