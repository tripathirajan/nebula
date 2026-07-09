import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Button } from '../button/button';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';

import { DropdownMenu } from './dropdown-menu';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function AccountMenu() {
  const [wrap, setWrap] = useState(true);
  const [sort, setSort] = useState('asc');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button color="secondary" size="sm">
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => {}}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}} disabled>
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Compact mode
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="asc">Sort ascending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">Sort descending</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export const Default: Story = {
  render: () => <AccountMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Account' });

    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    const body = within(document.body);
    const menu = await body.findByRole('menu');
    await expect(menu).toBeInTheDocument();

    await userEvent.click(body.getByRole('menuitem', { name: 'Profile' }));
    await expect(body.queryByRole('menu')).not.toBeInTheDocument();
  },
};

export const KeyboardNavigation: Story = {
  render: () => <AccountMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Account' });

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const body = within(document.body);
    await body.findByRole('menu');
    await expect(body.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('menu')).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};
