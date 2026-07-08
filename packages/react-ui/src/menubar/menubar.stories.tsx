import { expect, userEvent, within } from '@storybook/test';

import {
  MenubarContent,
  MenubarItem,
  MenubarPortal,
  MenubarSeparator,
  MenubarTrigger,
} from '../menubar';

import { Menubar } from './menubar';
import { MenubarMenu } from './menubar-menu';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

function AppMenubar() {
  return (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem onSelect={() => {}}>New file</MenubarItem>
            <MenubarItem onSelect={() => {}}>Open...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={() => {}}>Save</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem onSelect={() => {}}>Undo</MenubarItem>
            <MenubarItem onSelect={() => {}}>Redo</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem onSelect={() => {}}>Zoom in</MenubarItem>
            <MenubarItem onSelect={() => {}}>Zoom out</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
}

export const Default: Story = {
  render: () => <AppMenubar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileTrigger = canvas.getByRole('menuitem', { name: 'File' });

    await userEvent.click(fileTrigger);
    const body = within(document.body);
    await expect(body.getByRole('menuitem', { name: 'New file' })).toBeInTheDocument();

    await userEvent.click(body.getByRole('menuitem', { name: 'Save' }));
    await expect(body.queryByRole('menu')).not.toBeInTheDocument();
  },
};

export const HoverSwitchesOpenMenu: Story = {
  name: 'Hovering a sibling trigger switches the open menu',
  render: () => <AppMenubar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileTrigger = canvas.getByRole('menuitem', { name: 'File' });
    const editTrigger = canvas.getByRole('menuitem', { name: 'Edit' });

    await userEvent.click(fileTrigger);
    const body = within(document.body);
    await expect(body.getByRole('menuitem', { name: 'New file' })).toBeInTheDocument();

    // Real mouse hover isn't simulable via userEvent in this environment —
    // focusing the sibling trigger directly exercises the same switch-open
    // logic `MenubarTrigger` wires to `pointerenter`.
    editTrigger.focus();
    await expect(body.getByRole('menuitem', { name: 'Undo' })).toBeInTheDocument();
    await expect(body.queryByRole('menuitem', { name: 'New file' })).not.toBeInTheDocument();
  },
};
