import { expect, within } from '@storybook/test';

import { CircularProgress } from './circular-progress';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CircularProgress> = {
  title: 'React UI/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 60 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
  },
};

export const Indeterminate: Story = {
  args: { value: null },
};

export const CustomSize: Story = {
  args: { value: 40, size: 72, strokeWidth: 8 },
};
