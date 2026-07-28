import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { AlertPopup } from './alert-popup';

describe('AlertPopup', () => {
  it('opens on trigger click and renders title/description', () => {
    render(
      <AlertPopup
        trigger={<button type="button">Delete account</button>}
        icon="danger"
        title="Delete your account?"
        description="This can't be undone."
        primaryAction={{ label: 'Delete' }}
        secondaryAction={{ label: 'Cancel' }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete account' }));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Delete your account?')).toBeInTheDocument();
    expect(screen.getByText("This can't be undone.")).toBeInTheDocument();
  });

  it('renders a default icon per severity, and none when icon is null', () => {
    const { rerender } = render(
      <AlertPopup open icon="success" title="Done" primaryAction={{ label: 'OK' }} />,
    );
    expect(document.querySelector('[aria-hidden="true"] svg')).toBeInTheDocument();

    rerender(<AlertPopup open icon={null} title="Done" primaryAction={{ label: 'OK' }} />);
    expect(document.querySelector('[aria-hidden="true"] svg')).not.toBeInTheDocument();
  });

  it('calls primaryAction.onClick and closes on click', async () => {
    const onClick = vi.fn();
    render(
      <AlertPopup
        trigger={<button type="button">Open</button>}
        title="Saved"
        primaryAction={{ label: 'OK', onClick }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => screen.getByRole('alertdialog'));

    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('calls secondaryAction.onClick when provided, and omits the button when it is not', async () => {
    const onCancel = vi.fn();
    const { rerender } = render(
      <AlertPopup open title="Confirm" primaryAction={{ label: 'OK' }} secondaryAction={{ label: 'Cancel', onClick: onCancel }} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    rerender(<AlertPopup open title="Confirm" primaryAction={{ label: 'OK' }} />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('is not dismissed by clicking the overlay, only by an explicit action', async () => {
    render(
      <AlertPopup
        trigger={<button type="button">Open</button>}
        title="Are you sure?"
        primaryAction={{ label: 'OK' }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => screen.getByRole('alertdialog'));

    const overlay = document.querySelector('.fixed.inset-0')!;
    fireEvent.pointerDown(overlay);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('passes backdrop through to the overlay', () => {
    render(<AlertPopup open backdrop="blur" title="Title" primaryAction={{ label: 'OK' }} />);
    const overlay = document.querySelector('.fixed.inset-0')!;
    expect(overlay.className).toContain('backdrop-blur-xl');
  });

  it('has no axe violations', async () => {
    render(
      <AlertPopup
        open
        icon="warning"
        title="Delete this item?"
        description="This can't be undone."
        primaryAction={{ label: 'Delete' }}
        secondaryAction={{ label: 'Cancel' }}
      />,
    );
    await waitFor(() => screen.getByRole('alertdialog'));
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
