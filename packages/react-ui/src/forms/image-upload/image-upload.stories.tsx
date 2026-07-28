import { expect, within } from '@storybook/test';

import { ImageUpload } from './image-upload';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/ImageUpload',
  component: ImageUpload,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ImageUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { multiple: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Drop images here, or click to browse')).toBeInTheDocument();
    expect(canvasElement.querySelector('input[type="file"]')).not.toBeNull();
  },
};

export const CustomLabel: Story = {
  args: { multiple: true, dropzoneLabel: 'Add product photos' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Add product photos')).toBeInTheDocument();
  },
};
