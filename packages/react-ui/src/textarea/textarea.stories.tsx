import { expect, userEvent, within } from '@storybook/test';

import { TextArea } from './textarea';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Write a description…', 'aria-label': 'Description' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(textarea, 'A composable React UI platform.');
    await expect(textarea).toHaveValue('A composable React UI platform.');
  },
};

export const Invalid: Story = {
  args: { invalid: true, 'aria-label': 'Description' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  },
};
