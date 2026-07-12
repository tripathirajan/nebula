import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NotificationCenter } from './notification-center';

const notifications = [
  { id: '1', title: 'New comment', description: 'Jane replied', timestamp: '2m ago', read: false },
  { id: '2', title: 'Weekly summary', read: true },
];

describe('NotificationCenter (block)', () => {
  it('renders the title and every notification', () => {
    render(<NotificationCenter notifications={notifications} />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('New comment')).toBeInTheDocument();
    expect(screen.getByText('Weekly summary')).toBeInTheDocument();
  });

  it('shows the unread count as a badge', () => {
    render(<NotificationCenter notifications={notifications} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not render an unread badge when everything is read', () => {
    render(<NotificationCenter notifications={[{ id: '1', title: 'Read item', read: true }]} />);
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it('filters to only unread items on the Unread tab', async () => {
    const user = userEvent.setup();
    render(<NotificationCenter notifications={notifications} />);
    await user.click(screen.getByRole('tab', { name: /Unread/ }));
    expect(screen.getByText('New comment')).toBeInTheDocument();
    expect(screen.queryByText('Weekly summary')).not.toBeInTheDocument();
  });

  it('shows an empty state when notifications is empty', () => {
    render(<NotificationCenter notifications={[]} />);
    expect(screen.getByText('Nothing here.')).toBeInTheDocument();
  });

  it('calls onNotificationClick when a row is clicked', async () => {
    const user = userEvent.setup();
    const onNotificationClick = vi.fn();
    render(<NotificationCenter notifications={notifications} onNotificationClick={onNotificationClick} />);
    await user.click(screen.getByText('New comment'));
    expect(onNotificationClick).toHaveBeenCalledWith('1');
  });

  it('calls onMarkAllRead from the header action', async () => {
    const user = userEvent.setup();
    const onMarkAllRead = vi.fn();
    render(<NotificationCenter notifications={notifications} onMarkAllRead={onMarkAllRead} />);
    await user.click(screen.getByRole('button', { name: 'Mark all as read' }));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <NotificationCenter notifications={notifications} onMarkAllRead={vi.fn()} onMarkRead={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
