import { expect, within } from '@storybook/test';

import { Spinner } from './spinner';

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

const meta: Meta<typeof Spinner> = {
  title: 'React UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    color: { control: 'select', options: COLORS },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Every `color` at a glance — use `Playground` to try one interactively. */
export const AllColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {COLORS.map((color) => (
        <Spinner key={color} color={color} />
      ))}
    </div>
  ),
};

/** Try any `color` via the Controls panel. */
export const Playground: Story = {
  args: { color: 'primary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();
  },
};

export const Large: Story = {
  args: { className: 'h-8 w-8 border-4' },
};

export const CustomLabel: Story = {
  args: { label: 'Loading search results' },
};
