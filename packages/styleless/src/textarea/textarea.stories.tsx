import { Textarea } from './textarea';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Textarea> = {
  title: 'Styleless/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Write a description…' },
};

export const AutoResize: Story = {
  args: { autoResize: true, placeholder: 'Grows as you type…' },
};
