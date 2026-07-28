import { expect, userEvent, within } from '@storybook/test';

import { Tree } from './tree';
import { TreeGroup } from './tree-group';
import { TreeItem } from './tree-item';
import { TreeItemToggle } from './tree-item-toggle';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { type: 'single' },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tree
      type="single"
      defaultValue="src/index.ts"
      defaultExpandedValues={['src']}
      aria-label="Project files"
      style={{ listStyle: 'none', minWidth: 200 }}
    >
      <TreeItem value="src" expandable style={{ listStyle: 'none' }}>
        <TreeItemToggle aria-label="Toggle src">▸</TreeItemToggle>
        src
        <TreeGroup style={{ listStyle: 'none', paddingLeft: 16 }}>
          <TreeItem value="src/index.ts" style={{ listStyle: 'none' }}>
            index.ts
          </TreeItem>
          <TreeItem value="src/utils" expandable style={{ listStyle: 'none' }}>
            <TreeItemToggle aria-label="Toggle utils">▸</TreeItemToggle>
            utils
            <TreeGroup style={{ listStyle: 'none', paddingLeft: 16 }}>
              <TreeItem value="src/utils/format.ts" style={{ listStyle: 'none' }}>
                format.ts
              </TreeItem>
            </TreeGroup>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
      <TreeItem value="package.json" style={{ listStyle: 'none' }}>
        package.json
      </TreeItem>
    </Tree>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tree', { name: 'Project files' })).toBeInTheDocument();
    await expect(canvas.getByRole('treeitem', { name: /index\.ts/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('treeitem', { name: /^▸ src/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await userEvent.click(canvas.getByText('package.json'));
    await expect(canvas.getByRole('treeitem', { name: /package\.json/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const MultipleSelection: Story = {
  render: () => (
    <Tree
      type="multiple"
      defaultValue={['a']}
      aria-label="Multi-select tree"
      style={{ listStyle: 'none', minWidth: 200 }}
    >
      <TreeItem value="a" style={{ listStyle: 'none' }}>
        Item A
      </TreeItem>
      <TreeItem value="b" style={{ listStyle: 'none' }}>
        Item B
      </TreeItem>
      <TreeItem value="c" style={{ listStyle: 'none' }}>
        Item C
      </TreeItem>
    </Tree>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Item B'));
    await expect(canvas.getByRole('treeitem', { name: 'Item A' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('treeitem', { name: 'Item B' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};
