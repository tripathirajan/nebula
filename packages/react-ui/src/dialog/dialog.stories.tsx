import { expect, userEvent, within } from '@storybook/test';

import { Button } from '../button/button';

import { Dialog } from './dialog';
import { DialogClose } from './dialog-close';
import { DialogContent } from './dialog-content';
import { DialogDescription } from './dialog-description';
import { DialogOverlay } from './dialog-overlay';
import { DialogPortal } from './dialog-portal';
import { DialogTitle } from './dialog-title';
import { DialogTrigger } from './dialog-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Dialog> = {
  title: 'React UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DemoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Delete item</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogDescription>This can&apos;t be undone.</DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export const Default: Story = {
  render: () => <DemoDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Delete item' }));

    const body = within(document.body);
    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await expect(body.getByText("This can't be undone.")).toBeInTheDocument();

    await userEvent.click(body.getByRole('button', { name: 'Cancel' }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
