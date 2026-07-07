import { expect, userEvent, within } from '@storybook/test';

import { NumberInput } from './number-input';
import { NumberInputDecrement } from './number-input-decrement';
import { NumberInputField } from './number-input-field';
import { NumberInputIncrement } from './number-input-increment';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NumberInput defaultValue={1} min={0} max={5}>
      <NumberInputDecrement aria-label="Decrease">-</NumberInputDecrement>
      <NumberInputField aria-label="Quantity" />
      <NumberInputIncrement aria-label="Increase">+</NumberInputIncrement>
    </NumberInput>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('spinbutton', { name: 'Quantity' });
    const increment = canvas.getByRole('button', { name: 'Increase' });

    await expect(field).toHaveValue(1);
    await userEvent.click(increment);
    await expect(field).toHaveValue(2);
  },
};

export const ClampedAtBounds: Story = {
  render: () => (
    <NumberInput defaultValue={5} min={0} max={5}>
      <NumberInputDecrement aria-label="Decrease">-</NumberInputDecrement>
      <NumberInputField aria-label="Quantity" />
      <NumberInputIncrement aria-label="Increase">+</NumberInputIncrement>
    </NumberInput>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Increase' })).toBeDisabled();
  },
};
