import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Alert } from './alert';

describe('Alert', () => {
  it('renders the title and children', () => {
    render(<Alert title="Heads up">Something happened.</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Something happened.')).toBeInTheDocument();
  });

  it('uses role="status" for info/success and role="alert" for warning/danger', () => {
    const { rerender } = render(<Alert color="info">Info</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<Alert color="success">Success</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<Alert color="warning">Warning</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(<Alert color="danger">Danger</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders a default icon per color', () => {
    render(<Alert color="danger">Danger</Alert>);
    expect(screen.getByRole('alert').querySelector('svg')).toBeInTheDocument();
  });

  it('renders no icon when icon is explicitly null', () => {
    render(<Alert color="danger" icon={null}>Danger</Alert>);
    expect(screen.getByRole('alert').querySelector('svg')).not.toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert onDismiss={onDismiss} dismissLabel="Dismiss">
        Dismissible
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders no dismiss button when onDismiss is omitted', () => {
    render(<Alert>No dismiss</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Alert title="Heads up" onDismiss={() => {}} dismissLabel="Dismiss">
        Something happened.
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
