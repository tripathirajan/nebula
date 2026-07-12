import { expect, userEvent, waitFor, within } from '@storybook/test';

import { Button } from '../button/button';

import { AlertDialog } from './alert-dialog';
import { AlertDialogAction } from './alert-dialog-action';
import { AlertDialogCancel } from './alert-dialog-cancel';
import { AlertDialogContent } from './alert-dialog-content';

import {
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function ConfirmDeleteDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button color="danger">Delete item</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {}}>Delete</AlertDialogAction>
          </div>
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

    // See `dialog.stories.tsx`'s `Default` story for why this wait exists —
    // same `--motion-duration-base` fade/scale, same a11y-scan race to
    // avoid.
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));

    await userEvent.click(body.getByRole('button', { name: 'Delete' }));

    // Same `Presence`-driven exit-animation delay as the open side above —
    // poll rather than assert once, or a still-fading `data-state="closed"`
    // node gets caught.
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};

export const OutsideClickDoesNotDismiss: Story = {
  render: () => <ConfirmDeleteDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Delete item' }));
    const body = within(document.body);
    const dialog = await body.findByRole('alertdialog');
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));

    await userEvent.click(document.body);
    await expect(body.getByRole('alertdialog')).toBeInTheDocument();

    await userEvent.click(body.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};
