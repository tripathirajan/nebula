import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';

import { Button } from '../button/button';

import { Menu } from './menu';
import { MenuCheckboxItem } from './menu-checkbox-item';
import { MenuContent } from './menu-content';
import { MenuItem } from './menu-item';
import { MenuPortal } from './menu-portal';
import { MenuRadioGroup } from './menu-radio-group';
import { MenuRadioItem } from './menu-radio-item';
import { MenuSeparator } from './menu-separator';
import { MenuTrigger } from './menu-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

function FileMenu() {
  const [wrap, setWrap] = useState(true);
  const [sort, setSort] = useState('asc');

  return (
    <Menu>
      <MenuTrigger asChild>
        <Button color="secondary" size="sm">
          File
        </Button>
      </MenuTrigger>
      <MenuPortal>
        <MenuContent>
          <MenuItem onSelect={() => {}}>New file</MenuItem>
          <MenuItem onSelect={() => {}} disabled>
            Rename
          </MenuItem>
          <MenuSeparator />
          <MenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Word wrap
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuRadioGroup value={sort} onValueChange={setSort}>
            <MenuRadioItem value="asc">Ascending</MenuRadioItem>
            <MenuRadioItem value="desc">Descending</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </MenuPortal>
    </Menu>
  );
}

export const Default: Story = {
  render: () => <FileMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'File' });

    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    const body = within(document.body);
    const menu = await body.findByRole('menu');
    await expect(menu).toBeInTheDocument();

    // See `dialog.stories.tsx`'s `Default` story for why this wait exists —
    // `MenuContent` fades/scales in over `--motion-duration-fast` (150ms).
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe('1'));

    await userEvent.click(body.getByRole('menuitem', { name: 'New file' }));

    // Same `Presence`-driven exit-animation delay as the open side above —
    // poll rather than assert once, or a still-fading `data-state="closed"`
    // node gets caught.
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const KeyboardNavigation: Story = {
  render: () => <FileMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'File' });

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const body = within(document.body);
    const menu = await body.findByRole('menu');
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe('1'));

    // `toHaveFocus()` is a synchronous jest-dom matcher — it doesn't poll.
    // `FocusScope`'s mount-auto-focus (the effect that moves focus onto
    // "New file") runs in a passive `useEffect`, so a bare
    // `expect(...).toHaveFocus()` right after the opacity wait can still
    // read stale focus if that effect hasn't committed yet.
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'New file' })).toHaveFocus());

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());

    // Same reasoning as above — `FocusScope`'s unmount auto-focus (restoring
    // focus to the trigger) is also effect-driven, not synchronous with the
    // dismiss.
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
