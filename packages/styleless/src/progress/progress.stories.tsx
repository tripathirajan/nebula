import { expect, within } from '@storybook/test';

import { Progress } from './progress';
import { ProgressIndicator } from './progress-indicator';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {
  render: () => (
    <Progress value={60} style={{ width: 200 }}>
      <ProgressIndicator />
    </Progress>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', '60');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');
    await expect(bar).toHaveAttribute('data-state', 'loading');
  },
};

export const Complete: Story = {
  render: () => (
    <Progress value={100} style={{ width: 200 }}>
      <ProgressIndicator />
    </Progress>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('data-state', 'complete');
  },
};

export const Indeterminate: Story = {
  render: () => (
    <Progress value={null} style={{ width: 200 }}>
      <ProgressIndicator />
    </Progress>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar');
    await expect(bar).not.toHaveAttribute('aria-valuenow');
    await expect(bar).toHaveAttribute('data-state', 'indeterminate');
  },
};

export const WithValueLabel: Story = {
  render: () => (
    <Progress value={3} max={5} getValueLabel={(value, max) => `${value} of ${max} steps`}>
      <ProgressIndicator />
    </Progress>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 5 steps');
  },
};
