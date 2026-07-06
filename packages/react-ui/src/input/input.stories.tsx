import { expect, userEvent, within } from '@storybook/test';

import { Input } from './input';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'you@example.com', 'aria-label': 'Email' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'hi@nebula.dev');
    await expect(input).toHaveValue('hi@nebula.dev');
  },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'not-an-email', 'aria-label': 'Email' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Unavailable', 'aria-label': 'Email' },
};
