import { expect, within } from '@storybook/test';

import { Spinner } from './spinner';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Spinner> = {
  title: 'React UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();
  },
};

export const Large: Story = {
  args: { className: 'h-8 w-8 border-4' },
};

export const CustomLabel: Story = {
  args: { label: 'Loading search results' },
};
