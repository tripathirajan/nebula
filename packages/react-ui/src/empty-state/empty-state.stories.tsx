import { expect, within } from '@storybook/test';

import { Button } from '../button/button';

import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from './empty-state';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof EmptyState> = {
  title: 'React UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8.5 5.5 4h13L21 8.5m-18 0v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-11m-18 0h4.5l1 3h5l1-3H21"
      />
    </svg>
  );
}

export const Default: Story = {
  render: () => (
    <EmptyState>
      <EmptyStateIcon>
        <InboxIcon />
      </EmptyStateIcon>
      <EmptyStateTitle>No messages yet</EmptyStateTitle>
      <EmptyStateDescription>New messages will show up here once someone writes to you.</EmptyStateDescription>
      <EmptyStateAction>
        <Button>Compose</Button>
      </EmptyStateAction>
    </EmptyState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No messages yet')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Compose' })).toBeInTheDocument();
  },
};

export const NoAction: Story = {
  render: () => (
    <EmptyState>
      <EmptyStateTitle>No results found</EmptyStateTitle>
      <EmptyStateDescription>Try adjusting your search or filters.</EmptyStateDescription>
    </EmptyState>
  ),
};
