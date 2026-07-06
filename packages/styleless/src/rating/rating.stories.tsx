import { expect, userEvent, within } from '@storybook/test';

import { Rating } from './rating';
import { RatingItem } from './rating-item';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoRating(props: React.ComponentProps<typeof Rating>) {
  return (
    <Rating aria-label="Rate this product" {...props}>
      <RatingItem value={1} aria-label="1 star">
        ★
      </RatingItem>
      <RatingItem value={2} aria-label="2 stars">
        ★
      </RatingItem>
      <RatingItem value={3} aria-label="3 stars">
        ★
      </RatingItem>
      <RatingItem value={4} aria-label="4 stars">
        ★
      </RatingItem>
      <RatingItem value={5} aria-label="5 stars">
        ★
      </RatingItem>
    </Rating>
  );
}

export const Default: Story = {
  render: () => <DemoRating defaultValue={3} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const third = canvas.getByRole('radio', { name: '3 stars' });
    const fourth = canvas.getByRole('radio', { name: '4 stars' });

    await expect(third).toHaveAttribute('aria-checked', 'true');
    await expect(third).toHaveAttribute('data-state', 'filled');
    await expect(fourth).toHaveAttribute('data-state', 'empty');

    await userEvent.click(fourth);
    await expect(fourth).toHaveAttribute('aria-checked', 'true');
    await expect(fourth).toHaveAttribute('data-state', 'filled');
  },
};
