import { expect, within } from '@storybook/test';

import { Progress } from './progress';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Progress> = {
  title: 'React UI/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 60 },
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
