import { expect, userEvent, within } from '@storybook/test';

import { ColorPicker } from './color-picker';
import { ColorPickerContent } from './color-picker-content';
import { ColorPickerHexInput } from './color-picker-hex-input';
import { ColorPickerPortal } from './color-picker-portal';
import { ColorPickerTrigger } from './color-picker-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ColorPicker defaultValue="#3b82f6">
      <ColorPickerTrigger aria-label="Pick a color" />
      <ColorPickerPortal>
        <ColorPickerContent>
          <ColorPickerHexInput aria-label="Hex color" />
        </ColorPickerContent>
      </ColorPickerPortal>
    </ColorPicker>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Pick a color' });

    await userEvent.click(trigger);
    const hexInput = canvas.getByRole('textbox', { name: 'Hex color' });
    await expect(hexInput).toHaveValue('#3b82f6');

    await userEvent.clear(hexInput);
    await userEvent.type(hexInput, '#ff0000');
    await expect(hexInput).not.toHaveAttribute('aria-invalid', 'true');
  },
};
