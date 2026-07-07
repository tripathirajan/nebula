import { expect, within } from '@storybook/test';

import { TelInput } from './tel-input';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TelInput> = {
  title: 'Styleless/TelInput',
  component: TelInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'phone', placeholder: '+1 (555) 123-4567' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByPlaceholderText('+1 (555) 123-4567')).toHaveAttribute('type', 'tel');
  },
};
