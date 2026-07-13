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

describe('Dialog', () => {
  it('is closed initially and wires up aria-haspopup/aria-expanded on the trigger', () => {
    render(<DemoDialog />);
    const trigger = screen.getByRole('button', { name: 'Delete item' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('omits aria-controls while closed (DialogContent is unmounted, so the id would be dangling) and sets it once open', async () => {
    render(<DemoDialog />);
    const trigger = screen.getByRole('button', { name: 'Delete item' });
    expect(trigger).not.toHaveAttribute('aria-controls');

    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('dialog').id);
  });

  it('opens on trigger click, portals to document.body, and wires up aria-modal/labelledby/describedby', () => {
    render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));

    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Delete item?');
    const description = screen.getByText("This can't be undone.");

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });

  it('moves focus into the dialog on open', async () => {
    render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    });
  });

  it('closes and restores focus to the trigger on Escape', async () => {
    render(<DemoDialog />);
    const trigger = screen.getByRole('button', { name: 'Delete item' });
    // Real clicks focus the clicked button natively; `fireEvent.click`
    // doesn't emulate that, so it's done explicitly here — otherwise
    // there's nothing for the dialog to meaningfully restore focus *to*
    // once it closes.
    trigger.focus();
    fireEvent.click(trigger);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('closes on DialogClose click', async () => {
    render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes on outside pointerdown (e.g. clicking the overlay)', async () => {
    const { baseElement } = render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    const overlay = baseElement.querySelector('[data-state="open"]:not([role="dialog"])');
    expect(overlay).not.toBeNull();
    fireEvent.pointerDown(overlay as Element);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('has no axe violations', async () => {
    render(<DemoDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
