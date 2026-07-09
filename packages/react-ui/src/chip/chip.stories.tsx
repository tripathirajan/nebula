import { fn } from '@storybook/test';

import { Chip } from './chip';

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
  title: 'React UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Chip' },
  argTypes: {
    color: { control: 'select', options: COLORS },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every `color` at a glance — use `Playground` to try one interactively. */
export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {COLORS.map((color) => (
        <Chip key={color} color={color}>
          {color}
        </Chip>
      ))}
    </div>
  ),
};

/** Try any `color` via the Controls panel. */
export const Playground: Story = {
  args: { color: 'neutral' },
};

export const Dismissible: Story = {
  args: {
    color: 'info',
    children: 'Color: Blue',
    onDismiss: fn(),
    dismissLabel: 'Remove color filter',
  },
};
