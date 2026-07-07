import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Tree } from './tree';
import { TreeGroup } from './tree-group';
import { TreeItem } from './tree-item';
import { TreeItemToggle } from './tree-item-toggle';

function fileTreeChildren() {
  return (
    <>
      <TreeItem value="src" expandable>
        <TreeItemToggle aria-label="Toggle src">▸</TreeItemToggle>
        src
        <TreeGroup>
          <TreeItem value="src/index.ts">index.ts</TreeItem>
          <TreeItem value="src/utils.ts">utils.ts</TreeItem>
        </TreeGroup>
      </TreeItem>
      <TreeItem value="package.json">package.json</TreeItem>
    </>
  );
}

function FileTree(props: { defaultExpandedValues?: string[] }) {
  return (
    <Tree type="single" defaultExpandedValues={props.defaultExpandedValues} aria-label="Files">
      {fileTreeChildren()}
    </Tree>
  );
}

function MultiSelectFileTree(props: {
  onValueChange?: (value: string[]) => void;
  defaultExpandedValues?: string[];
}) {
  return (
    <Tree
      type="multiple"
      onValueChange={props.onValueChange}
      defaultExpandedValues={props.defaultExpandedValues}
      aria-label="Files"
    >
      {fileTreeChildren()}
    </Tree>
  );
}

describe('Tree', () => {
  it('renders role="tree" with the given aria-label', () => {
    render(<FileTree />);
    expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
  });

  it('renders top-level items as treeitem role', () => {
    render(<FileTree />);
    expect(screen.getByRole('treeitem', { name: /package\.json/ })).toBeInTheDocument();
  });

  it('collapsed groups are not in the document at all', () => {
    render(<FileTree />);
    expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
  });

  it('expanding via TreeItemToggle mounts the nested group', async () => {
    const user = userEvent.setup();
    render(<FileTree />);
    await user.click(screen.getByRole('button', { name: 'Toggle src' }));
    expect(screen.getByText('index.ts')).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: /^▸? ?src/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('clicking the toggle does not also select the item', async () => {
    const user = userEvent.setup();
    render(<FileTree />);
    await user.click(screen.getByRole('button', { name: 'Toggle src' }));
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('single-select: clicking a leaf item selects it and deselects the previous one', async () => {
    const user = userEvent.setup();
    render(<FileTree defaultExpandedValues={['src']} />);
    await user.click(screen.getByText('index.ts'));
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(screen.getByText('utils.ts'));
    expect(screen.getByRole('treeitem', { name: 'utils.ts' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('multiple-select: clicking toggles each item independently', async () => {
    const user = userEvent.setup();
    render(<MultiSelectFileTree defaultExpandedValues={['src']} />);
    await user.click(screen.getByText('index.ts'));
    await user.click(screen.getByText('utils.ts'));
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('treeitem', { name: 'utils.ts' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(screen.getByText('index.ts'));
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('the first item defaults into the roving tab sequence', () => {
    render(<FileTree />);
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('tabIndex', '0');
    expect(screen.getByRole('treeitem', { name: /package\.json/ })).toHaveAttribute(
      'tabIndex',
      '-1',
    );
  });

  it('ArrowDown/ArrowUp move focus between visible items', async () => {
    const user = userEvent.setup();
    render(<FileTree />);
    const srcItem = screen.getByRole('treeitem', { name: /src/ });
    srcItem.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('treeitem', { name: /package\.json/ })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(srcItem).toHaveFocus();
  });

  it('ArrowRight expands a collapsed item, then moves into its first child', async () => {
    const user = userEvent.setup();
    render(<FileTree />);
    const srcItem = screen.getByRole('treeitem', { name: /src/ });
    srcItem.focus();

    await user.keyboard('{ArrowRight}');
    expect(srcItem).toHaveAttribute('aria-expanded', 'true');
    expect(srcItem).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toHaveFocus();
  });

  it('ArrowLeft collapses an expanded item, then moves focus to the parent', async () => {
    const user = userEvent.setup();
    render(<FileTree defaultExpandedValues={['src']} />);
    const childItem = screen.getByRole('treeitem', { name: 'index.ts' });
    childItem.focus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('Home/End jump to the first/last visible item', async () => {
    const user = userEvent.setup();
    render(<FileTree defaultExpandedValues={['src']} />);
    const items = screen.getAllByRole('treeitem');
    expect(items[1]).toBeDefined();
    items[1]?.focus();

    await user.keyboard('{End}');
    expect(screen.getByRole('treeitem', { name: /package\.json/ })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveFocus();
  });

  it('a disabled item ignores clicks', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tree type="single" onValueChange={onValueChange} aria-label="Files">
        <TreeItem value="a" disabled>
          Item A
        </TreeItem>
      </Tree>,
    );
    await user.click(screen.getByText('Item A'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('treeitem', { name: 'Item A' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<FileTree defaultExpandedValues={['src']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
