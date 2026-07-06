import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Dialog } from './dialog';
import { DialogClose } from './dialog-close';
import { DialogContent } from './dialog-content';
import { DialogDescription } from './dialog-description';
import { DialogOverlay } from './dialog-overlay';
import { DialogPortal } from './dialog-portal';
import { DialogTitle } from './dialog-title';
import { DialogTrigger } from './dialog-trigger';

function DemoDialog() {
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

describe('Dialog (ui)', () => {
  it('opens on trigger click and renders the styled content', () => {
    render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));

    const content = screen.getByRole('dialog');
    expect(content.className).toContain('bg-[var(--dialog-content-bg)]');
  });

  it('renders a built-in close icon button by default', () => {
    render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('omits the built-in close button when hideCloseButton is set', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal>
          <DialogContent hideCloseButton>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </DialogPortal>
      </Dialog>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('closes via DialogClose', async () => {
    render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('has no axe violations', async () => {
    render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => screen.getByRole('dialog'));
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
