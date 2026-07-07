import { expect, within } from '@storybook/test';

import { TelField } from './tel-field';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/TelField',
  component: TelField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TelField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'phone', placeholder: '+1 (555) 123-4567', 'aria-label': 'Phone number' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toHaveAttribute('type', 'tel');
  },
};
