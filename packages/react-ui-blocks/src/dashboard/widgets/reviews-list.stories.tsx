import { ReviewsList } from './reviews-list';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Widgets/Reviews List',
  component: ReviewsList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ReviewsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Reviews',
    reviews: [
      {
        id: '1',
        author: 'Jane Cooper',
        rating: 5,
        date: '2 days ago',
        content: 'Great course, learned a lot! The pacing was perfect for a beginner like me.',
      },
      {
        id: '2',
        author: 'Wade Warren',
        rating: 3.5,
        date: '1 week ago',
        content: 'Good content overall, though some sections felt a bit rushed.',
      },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ReviewsList {...args} />
    </div>
  ),
};
