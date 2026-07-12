import { expect, userEvent, within } from '@storybook/test';

import { NotificationCenter } from './notification-center';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Communication/Notification Center',
  component: NotificationCenter,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NotificationCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

const notifications = [
  { id: '1', title: 'New comment', description: 'Jane replied to your ticket', timestamp: '2m ago', read: false },
  { id: '2', title: 'Deploy finished', description: 'main deployed to production', timestamp: '1h ago', read: false },
  { id: '3', title: 'Weekly summary', description: 'Your usage report is ready', timestamp: 'Yesterday', read: true },
  { id: '4', title: 'New team member', description: 'Sam joined your workspace', timestamp: '3d ago', read: true },
];

export const Default: Story = {
  args: { notifications },
};

export const Empty: Story = {
  args: { notifications: [] },
};

export const Interactive: Story = {
  args: { notifications },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Unread count badge reflects the unread items.
    await expect(canvas.getByText('2')).toBeInTheDocument();

    // Switching to the Unread tab filters the list.
    await userEvent.click(canvas.getByRole('tab', { name: /Unread/ }));
    await expect(canvas.getByText('New comment')).toBeInTheDocument();
    await expect(canvas.queryByText('Weekly summary')).not.toBeInTheDocument();
  },
};
