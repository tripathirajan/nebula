import { expect, within } from '@storybook/test';

import { Progress } from './progress';

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

const meta: Meta<typeof Progress> = {
  title: 'React UI/Progress',
  component: Progress,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
      {COLORS.map((color) => (
        <Progress key={color} value={60} color={color} />
      ))}
    </div>
  ),
};

/** Try any `color`/`value` via the Controls panel. */
export const Playground: Story = {
  args: { value: 60, color: 'primary' },
  render: (args) => <Progress {...args} style={{ width: 240 }} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
  },
};

export const Complete: Story = {
  args: { value: 100 },
  render: (args) => <Progress {...args} style={{ width: 240 }} />,
};

export const Indeterminate: Story = {
  args: { value: null },
  render: (args) => <Progress {...args} style={{ width: 240 }} />,
};

export const WithValueLabel: Story = {
  render: () => (
    <Progress
      value={3}
      max={5}
      getValueLabel={(value, max) => `${value} of ${max} steps`}
      style={{ width: 240 }}
    />
  ),
};
