import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TreeView } from './tree-view';
import { TreeViewGroup } from './tree-view-group';
import { TreeViewItem } from './tree-view-item';
import { TreeViewItemToggle } from './tree-view-item-toggle';

function DemoTreeView() {
  return (
    <TreeView type="single" defaultExpandedValues={['fruits']} aria-label="Categories">
      <TreeViewItem value="fruits" expandable>
        <TreeViewItemToggle aria-label="Toggle fruits">▸</TreeViewItemToggle>
        Fruits
        <TreeViewGroup>
          <TreeViewItem value="fruits/apple">Apple</TreeViewItem>
        </TreeViewGroup>
      </TreeViewItem>
    </TreeView>
  );
}

describe('TreeView', () => {
  it('is Tree under a different name (renders role="tree"/"treeitem")', () => {
    render(<DemoTreeView />);
    expect(screen.getByRole('tree', { name: 'Categories' })).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'Apple' })).toBeInTheDocument();
  });

  it('selects an item on click', () => {
    render(<DemoTreeView />);
    fireEvent.click(screen.getByText('Apple'));
    expect(screen.getByRole('treeitem', { name: 'Apple' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
