import { expect, within } from '@storybook/test';

import { CircularProgress } from './circular-progress';

import type { Meta, StoryObj } from '@storybook/react';

const COLORS = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
] as const;

const meta: Meta<typeof CircularProgress> = {
  title: 'React UI/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    color: { control: 'select', options: COLORS },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Every `color` at a glance — use `Playground` to try one interactively. */
export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {COLORS.map((color) => (
        <CircularProgress key={color} value={60} color={color} />
      ))}
    </div>
  ),
};

/** Try any `color`/`value` via the Controls panel. */
export const Playground: Story = {
  args: { value: 60, color: 'primary' },
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
