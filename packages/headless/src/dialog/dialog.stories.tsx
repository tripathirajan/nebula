import { expect, userEvent, within } from '@storybook/test';


import { Dialog } from './dialog';
import { DialogClose } from './dialog-close';
import { DialogContent } from './dialog-content';
import { DialogDescription } from './dialog-description';
import { DialogOverlay } from './dialog-overlay';
import { DialogPortal } from './dialog-portal';
import { DialogTitle } from './dialog-title';
import { DialogTrigger } from './dialog-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger>Delete item</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogDescription>This can&apos;t be undone.</DialogDescription>
          <DialogClose>Cancel</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <ConfirmDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Delete item' });

    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    // DialogContent portals to document.body, outside canvasElement — query the body.
    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAccessibleName('Delete item?');

    await userEvent.click(body.getByRole('button', { name: 'Cancel' }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CloseOnEscape: Story = {
  render: () => <ConfirmDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Delete item' }));

    const body = within(document.body);
    await body.findByRole('dialog');

    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
