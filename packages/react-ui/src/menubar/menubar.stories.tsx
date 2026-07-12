import { expect, fireEvent, userEvent, waitFor, within } from '@storybook/test';

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

    // `MenubarContent` is `MenuContent` (see `../menu/menu-content.tsx`) —
    // same `Presence`-driven exit-animation delay, so this has to poll
    // rather than assert once.
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
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

    // `editTrigger.focus()` alone is unreliable here: this browser tab
    // doesn't hold real OS/window-level focus in this environment
    // (`document.hasFocus()` is `false`), and Chromium only updates
    // `document.activeElement` in that state without actually dispatching a
    // `focus` event — so `MenubarTrigger`'s `onFocus`-driven switch logic
    // never runs. `fireEvent.focusIn` dispatches a real `focusin` event
    // directly, which is what React actually listens for at the root to
    // implement its synthetic `onFocus` (native `focus` doesn't bubble,
    // `focusin` does — `fireEvent.focus` alone dispatches the former and
    // silently never reaches React's delegated listener), sidestepping the
    // window-focus dependency entirely. Real mouse hover isn't simulable
    // via `userEvent` in this environment either — this exercises the same
    // switch-open logic `MenubarTrigger` wires to both `pointerenter` and
    // keyboard arrow navigation, since both paths funnel through the same
    // `onFocus` handler.
    editTrigger.focus();
    fireEvent.focusIn(editTrigger);

    // `findByRole` (not `getByRole`) — the trigger's `onFocus` handler
    // updates `Menubar`'s active-menu state, but that state update (and the
    // resulting re-render that mounts Edit's `MenuContent`) happens
    // asynchronously relative to this synchronous `.focus()` call, so a
    // same-tick synchronous query can run before React has caught up.
    await expect(await body.findByRole('menuitem', { name: 'Undo' })).toBeInTheDocument();

    // Longer timeout than this file's other `waitFor` calls: by this point
    // in the story, `findByRole('Undo')` above has already spent some of
    // its own polling budget waiting on React to catch up with the
    // `fireEvent.focusIn` call, and a cold/unminified dev build's first run
    // through the `MenuContent` exit transition plus this instrumented
    // test harness can push File's belated unmount past the default 1000ms.
    await waitFor(
      () => expect(body.queryByRole('menuitem', { name: 'New file' })).not.toBeInTheDocument(),
      { timeout: 3000 },
    );
  },
};
