import { expect, within } from '@storybook/test';

import { Skeleton } from './skeleton';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Skeleton> = {
  title: 'React UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: 'h-4 w-40', 'data-testid': 'skeleton' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const AvatarPlaceholder: Story = {
  args: { shape: 'circle', className: 'h-12 w-12' },
};

export const Square: Story = {
  args: { shape: 'square', className: 'h-12 w-12' },
};

export const ProfileCardGroup: Story = {
  name: 'Grouped under one announced status',
  render: () => (
    <div role="status" aria-label="Loading profile" style={{ display: 'flex', gap: 12 }}>
      <Skeleton shape="circle" className="h-12 w-12" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  ),
};
