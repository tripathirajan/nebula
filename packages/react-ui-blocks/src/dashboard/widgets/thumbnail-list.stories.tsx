import { ThumbnailList } from './thumbnail-list';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Widgets/Thumbnail List',
  component: ThumbnailList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ThumbnailList>;

export default meta;
type Story = StoryObj<typeof meta>;

function Thumb({ color }: { color: string }) {
  return <span className="block h-10 w-10 rounded-[var(--radius-box)]" style={{ backgroundColor: color }} />;
}

export const Default: Story = {
  args: {
    title: 'Best sellers',
    items: [
      {
        id: '1',
        thumbnail: <Thumb color="var(--color-primary)" />,
        label: 'Wireless earbuds',
        description: '320 sold',
        trend: { direction: 'up', value: '+12%' },
      },
      {
        id: '2',
        thumbnail: <Thumb color="var(--color-info)" />,
        label: 'Smart watch',
        description: '210 sold',
        trend: { direction: 'down', value: '-4%' },
      },
      {
        id: '3',
        thumbnail: <Thumb color="var(--color-success)" />,
        label: 'Bluetooth speaker',
        description: '180 sold',
        trend: { direction: 'up', value: '+8%' },
      },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <ThumbnailList {...args} />
    </div>
  ),
};
