import { expect, within } from '@storybook/test';

import { Skeleton } from './skeleton';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Skeleton data-testid="skeleton-story-default" style={{ width: 200, height: 16 }} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const skeleton = canvas.getByTestId('skeleton-story-default');
    await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  },
};

export const ProfileCardGroup: Story = {
  name: 'Grouped under one announced status',
  render: () => (
    <div role="status" aria-label="Loading profile" style={{ display: 'flex', gap: 12 }}>
      <Skeleton style={{ width: 48, height: 48, borderRadius: 9999 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton style={{ width: 160, height: 12 }} />
        <Skeleton style={{ width: 120, height: 12 }} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status', { name: 'Loading profile' })).toBeInTheDocument();
  },
};
