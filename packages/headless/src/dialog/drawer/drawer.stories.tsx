import { expect, userEvent, within } from '@storybook/test';

import { Drawer } from './drawer';
import { DrawerClose } from './drawer-close';
import { DrawerContent } from './drawer-content';
import { DrawerOverlay } from './drawer-overlay';
import { DrawerPortal } from './drawer-portal';
import { DrawerTitle } from './drawer-title';
import { DrawerTrigger } from './drawer-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function CartDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>Open cart</DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent side="right">
          <DrawerTitle>Your cart</DrawerTitle>
          <DrawerClose aria-label="Close">×</DrawerClose>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

export const Default: Story = {
  render: () => <CartDrawer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open cart' }));

    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toHaveAttribute('data-side', 'right');

    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const LeftSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger>Open menu</DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent side="left">
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toHaveAttribute('data-side', 'left');
  },
};
