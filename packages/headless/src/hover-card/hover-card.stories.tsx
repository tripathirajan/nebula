import { expect, fireEvent, waitFor, within } from '@storybook/test';

import { HoverCard } from './hover-card';
import { HoverCardContent } from './hover-card-content';
import { HoverCardPortal } from './hover-card-portal';
import { HoverCardTrigger } from './hover-card-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { openDelay: 0, closeDelay: 0 },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <HoverCard openDelay={args.openDelay} closeDelay={args.closeDelay}>
      <HoverCardTrigger href="/u/jane">@jane</HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent>Jane Doe — Product Designer</HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('link', { name: '@jane' });
    await expect(trigger).toHaveAttribute('data-state', 'closed');

    fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('data-state', 'open'));
    await expect(canvas.getByText('Jane Doe — Product Designer')).toBeInTheDocument();

    fireEvent.pointerLeave(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('data-state', 'closed'));
  },
};
