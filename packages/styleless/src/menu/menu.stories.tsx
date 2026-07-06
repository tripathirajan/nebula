import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';


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
  title: 'Styleless/Menu',
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
      <MenuTrigger>File</MenuTrigger>
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

    await userEvent.click(body.getByRole('menuitem', { name: 'New file' }));
    await expect(body.queryByRole('menu')).not.toBeInTheDocument();
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
    await body.findByRole('menu');
    await expect(body.getByRole('menuitem', { name: 'New file' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('menu')).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};
