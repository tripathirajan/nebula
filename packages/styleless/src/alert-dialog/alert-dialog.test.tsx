import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { AlertDialog } from './alert-dialog';
import { AlertDialogAction } from './alert-dialog-action';
import { AlertDialogCancel } from './alert-dialog-cancel';
import { AlertDialogContent } from './alert-dialog-content';
import { AlertDialogDescription } from './alert-dialog-description';
import { AlertDialogOverlay } from './alert-dialog-overlay';
import { AlertDialogPortal } from './alert-dialog-portal';
import { AlertDialogTitle } from './alert-dialog-title';
import { AlertDialogTrigger } from './alert-dialog-trigger';

function DemoAlertDialog({ onConfirm = vi.fn() }: { onConfirm?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete item</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

describe('AlertDialog', () => {
  it('is closed initially', () => {
    render(<DemoAlertDialog />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click with role="alertdialog" and aria-modal/labelledby/describedby', () => {
    render(<DemoAlertDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));

    const dialog = screen.getByRole('alertdialog');
    const title = screen.getByText('Delete this item?');
    const description = screen.getByText("This can't be undone.");

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });

  it('moves focus into the dialog on open', async () => {
    render(<DemoAlertDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    });
  });

  it('does NOT close on an outside pointerdown (unlike Dialog)', async () => {
    const { baseElement } = render(<DemoAlertDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument());

    fireEvent.pointerDown(baseElement);
    // Give any (incorrect) async close a chance to happen before asserting.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('closes and restores focus to the trigger on Escape', async () => {
    render(<DemoAlertDialog />);
    const trigger = screen.getByRole('button', { name: 'Delete item' });
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('closes on AlertDialogCancel click without calling the confirm handler', async () => {
    const onConfirm = vi.fn();
    render(<DemoAlertDialog onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('closes on AlertDialogAction click and calls the confirm handler', async () => {
    const onConfirm = vi.fn();
    render(<DemoAlertDialog onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('has no axe violations', async () => {
    render(<DemoAlertDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete item' }));
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument());

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
