import { expect, userEvent, within } from '@storybook/test';

import { AlertDialog } from './alert-dialog';
import { AlertDialogAction } from './alert-dialog-action';
import { AlertDialogCancel } from './alert-dialog-cancel';
import { AlertDialogContent } from './alert-dialog-content';
import { AlertDialogDescription } from './alert-dialog-description';
import { AlertDialogOverlay } from './alert-dialog-overlay';
import { AlertDialogPortal } from './alert-dialog-portal';
import { AlertDialogTitle } from './alert-dialog-title';
import { AlertDialogTrigger } from './alert-dialog-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function ConfirmDeleteDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete item</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {}}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export const Default: Story = {
  render: () => <ConfirmDeleteDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Delete item' });

    await expect(canvas.queryByRole('alertdialog')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    const body = within(document.body);
    const dialog = await body.findByRole('alertdialog');
    await expect(dialog).toBeInTheDocument();

    await userEvent.click(body.getByRole('button', { name: 'Delete' }));
    await expect(body.queryByRole('alertdialog')).not.toBeInTheDocument();
  },
};

export const OutsideClickDoesNotDismiss: Story = {
  render: () => <ConfirmDeleteDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Delete item' }));
    const body = within(document.body);
    await body.findByRole('alertdialog');

    // Clicking the overlay is an "outside" pointerdown — unlike Dialog, this
    // must NOT close an alert dialog.
    await userEvent.click(document.body);
    await expect(body.getByRole('alertdialog')).toBeInTheDocument();

    await userEvent.click(body.getByRole('button', { name: 'Cancel' }));
    await expect(body.queryByRole('alertdialog')).not.toBeInTheDocument();
  },
};
