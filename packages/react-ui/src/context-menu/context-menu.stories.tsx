import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../context-menu';

import { ContextMenu } from './context-menu';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function RightClickArea() {
  const [bold, setBold] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-32 w-56 items-center justify-center rounded-[var(--radius-box)] border border-dashed border-[var(--color-base-300)] text-sm">
          Right-click this area
        </div>
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => {}}>Copy</ContextMenuItem>
          <ContextMenuItem onSelect={() => {}} disabled>
            Paste
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={bold} onCheckedChange={setBold}>
            Bold
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  );
}

export const Default: Story = {
  render: () => <RightClickArea />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Right-click this area');

    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();

    // jsdom/Storybook's userEvent has no dedicated "right-click" helper, so
    // the contextmenu event is fired directly — this is the same event a
    // real right-click (or a trackpad's two-finger tap) dispatches.
    trigger.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 50, clientY: 60 }),
    );

    const body = within(document.body);
    const menu = await body.findByRole('menu');
    await expect(menu).toBeInTheDocument();

    await userEvent.click(body.getByRole('menuitem', { name: 'Copy' }));
    await expect(body.queryByRole('menu')).not.toBeInTheDocument();
  },
};
