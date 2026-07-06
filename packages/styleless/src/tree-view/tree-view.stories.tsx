import { expect, userEvent, within } from '@storybook/test';

import { TreeView } from './tree-view';
import { TreeViewGroup } from './tree-view-group';
import { TreeViewItem } from './tree-view-item';
import { TreeViewItemToggle } from './tree-view-item-toggle';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { type: 'single' },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TreeView type="single" defaultExpandedValues={['fruits']} aria-label="Categories">
      <TreeViewItem value="fruits" expandable>
        <TreeViewItemToggle aria-label="Toggle fruits">▸</TreeViewItemToggle>
        Fruits
        <TreeViewGroup>
          <TreeViewItem value="fruits/apple">Apple</TreeViewItem>
          <TreeViewItem value="fruits/banana">Banana</TreeViewItem>
        </TreeViewGroup>
      </TreeViewItem>
      <TreeViewItem value="vegetables">Vegetables</TreeViewItem>
    </TreeView>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tree', { name: 'Categories' })).toBeInTheDocument();

    await userEvent.click(canvas.getByText('Apple'));
    await expect(canvas.getByRole('treeitem', { name: 'Apple' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};
