import { expect, userEvent, within } from '@storybook/test';

import { SegmentedControl } from './segmented-control';
import { SegmentedControlItem } from './segmented-control-item';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <SegmentedControl {...args} aria-label="View">
      <SegmentedControlItem value="list">List</SegmentedControlItem>
      <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      <SegmentedControlItem value="table">Table</SegmentedControlItem>
    </SegmentedControl>
  ),
  args: { defaultValue: 'list' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('button', { name: 'List' });
    const grid = canvas.getByRole('button', { name: 'Grid' });
    await expect(list).toHaveAttribute('data-state', 'on');
    await expect(grid).toHaveAttribute('data-state', 'off');

    await userEvent.click(grid);
    await expect(grid).toHaveAttribute('data-state', 'on');
    await expect(list).toHaveAttribute('data-state', 'off');
  },
};
