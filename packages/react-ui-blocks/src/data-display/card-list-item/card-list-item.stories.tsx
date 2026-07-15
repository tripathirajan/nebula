import { Avatar, AvatarFallback } from '@nebula/react-ui/avatar';
import { Badge } from '@nebula/react-ui/badge';
import { MenuItem } from '@nebula/react-ui/menu';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import { CardListItem } from './card-list-item';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CardListItem> = {
  title: 'Blocks/Data Display/Card List Item',
  component: CardListItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DollarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export const User: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <CardListItem
        avatar={
          <Avatar>
            <AvatarFallback>J</AvatarFallback>
          </Avatar>
        }
        title="Jane Cooper"
        description="jane@example.com"
        trailing={<Badge color="success">Active</Badge>}
        actions={
          <>
            <MenuItem onSelect={() => {}}>Edit</MenuItem>
            <MenuItem onSelect={() => {}}>Delete</MenuItem>
          </>
        }
      />
    </div>
  ),
};

export const Transaction: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <CardListItem
        icon={<DollarIcon />}
        title="Stripe payout"
        description="Oct 12, 2026 · 4:02 PM"
        trailing={<span className="font-semibold text-[var(--color-success-text)]">+$1,240.00</span>}
      />
    </div>
  ),
};

export const InteractiveRow: Story = {
  name: 'Interactive (clickable row)',
  render: () => (
    <div style={{ width: 360 }}>
      <CardListItem
        avatar={
          <Avatar>
            <AvatarFallback>W</AvatarFallback>
          </Avatar>
        }
        title="Wade Warren"
        description="wade@example.com"
        onClick={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('button', { name: /Wade Warren/ });
    await expect(row).toHaveAttribute('tabIndex', '0');
  },
};

export const StackedList: Story = {
  name: 'Stacked as a list (small-screen fallback shape)',
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { name: 'Angelique Morse', email: 'benny89@yahoo.com', status: 'banned' as const },
        { name: 'Ariana Lang', email: 'avery43@hotmail.com', status: 'pending' as const },
        { name: 'Brycen Jimenez', email: 'tyrel.greenholt@gmail.com', status: 'active' as const },
      ].map((user) => (
        <CardListItem
          key={user.email}
          avatar={
            <Avatar>
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          }
          title={user.name}
          description={user.email}
          trailing={
            <Badge color={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'}>
              {user.status}
            </Badge>
          }
          actions={<MenuItem onSelect={() => {}}>Edit</MenuItem>}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Angelique Morse')).toBeInTheDocument();
    await userEvent.click(canvas.getAllByRole('button', { name: 'Row actions' })[0]!);
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument());
  },
};
