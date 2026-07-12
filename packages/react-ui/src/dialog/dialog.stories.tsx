import { expect, userEvent, waitFor, within } from '@storybook/test';

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
        <Button color="danger">Delete item</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogDescription>This can&apos;t be undone.</DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button color="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button color="danger" size="sm">
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
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toBeInTheDocument();
    await expect(body.getByText("This can't be undone.")).toBeInTheDocument();

    // `DialogContent` fades/scales in over `--motion-duration-base` (200ms)
    // — without waiting for it to settle, an a11y scan racing this play
    // function can catch a still-near-transparent frame and misreport a
    // color-contrast violation that no real user ever perceives (the
    // animation is well under a user's reaction time). Same fix applied to
    // every story in this repo that opens an animated overlay and then
    // immediately asserts/interacts further.
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));

    await userEvent.click(body.getByRole('button', { name: 'Cancel' }));

    // Same `Presence`-driven exit-animation delay documented above for the
    // open side — the closed node stays mounted through
    // `--motion-duration-base` (200ms), so this has to poll rather than
    // assert once.
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
