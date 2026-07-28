import { Tag } from './tag';

import type { Meta, StoryObj } from '@storybook/react';

const COLORS = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
] as const;

const meta = {
  title: 'React UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Tag' },
  argTypes: {
    color: { control: 'select', options: COLORS },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every `color` at a glance — use `Playground` to try one interactively. */
export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {COLORS.map((color) => (
        <Tag key={color} color={color}>
          {color}
        </Tag>
      ))}
    </div>
  ),
};

/** Try any `color` via the Controls panel. */
export const Playground: Story = {
  args: { color: 'neutral' },
};
