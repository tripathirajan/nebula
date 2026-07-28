import { Sparkline } from './sparkline';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

const trendUp = [4, 8, 6, 9, 7, 12, 10, 14, 11, 16];
const trendDown = [16, 14, 15, 11, 12, 8, 9, 6, 7, 4];

export const Line: Story = {
  args: { data: trendUp, className: 'h-8 w-24 text-[var(--color-success)]' },
};

export const Down: Story = {
  args: { data: trendDown, className: 'h-8 w-24 text-[var(--color-error)]' },
};

export const Area: Story = {
  args: { data: trendUp, variant: 'area' },
  render: (args) => (
    <div className="rounded-[var(--radius-card)] bg-[var(--color-primary)] p-4">
      <Sparkline
        data={args.data}
        variant={args.variant}
        className="h-10 w-32 text-[var(--color-primary-content)]"
      />
    </div>
  ),
};

export const SinglePoint: Story = {
  args: { data: [5], className: 'h-8 w-24 text-[var(--color-neutral)]' },
};

export const FlatData: Story = {
  args: { data: [5, 5, 5, 5, 5], className: 'h-8 w-24 text-[var(--color-neutral)]' },
};
