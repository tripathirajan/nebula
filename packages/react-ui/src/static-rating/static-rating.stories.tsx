import { StaticRating } from './static-rating';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/StaticRating',
  component: StaticRating,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StaticRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 4 },
};

export const FractionalValue: Story = {
  name: 'Fractional value (rounds to nearest star)',
  args: { value: 4.5 },
};

export const AllValues: Story = {
  name: 'All whole-star values',
  args: { value: 0 },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[0, 1, 2, 3, 4, 5].map((value) => (
        <StaticRating key={value} value={value} />
      ))}
    </div>
  ),
};
