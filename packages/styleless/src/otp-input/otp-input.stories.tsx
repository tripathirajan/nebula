import { expect, userEvent, within } from '@storybook/test';

import { OTPInput } from './otp-input';
import { OTPInputSlot } from './otp-input-slot';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
  // `length` is a required prop with no sensible default, same reason
  // `ToggleGroup`'s story meta sets `args: { type: 'single' }`.
  args: { length: 4 },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <OTPInput length={4} name="code">
      {Array.from({ length: 4 }, (_, index) => (
        <OTPInputSlot key={index} index={index} aria-label={`Digit ${index + 1}`} />
      ))}
    </OTPInput>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('textbox', { name: 'Digit 1' });

    await userEvent.type(first, '1234');

    await expect(canvas.getByRole('textbox', { name: 'Digit 1' })).toHaveValue('1');
    await expect(canvas.getByRole('textbox', { name: 'Digit 2' })).toHaveValue('2');
    await expect(canvas.getByRole('textbox', { name: 'Digit 3' })).toHaveValue('3');
    await expect(canvas.getByRole('textbox', { name: 'Digit 4' })).toHaveValue('4');
  },
};
