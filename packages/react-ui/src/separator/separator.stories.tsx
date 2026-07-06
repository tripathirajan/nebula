import { expect, within } from '@storybook/test';

import { Separator } from './separator';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Separator> = {
  title: 'React UI/Separator',
  component: Separator,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-sm">
      <p>Section one</p>
      <Separator className="my-3" />
      <p>Section two</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Decorative by default — not exposed to the accessibility tree.
    await expect(canvas.queryByRole('separator')).not.toBeInTheDocument();
  },
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3">
      <span>Profile</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  ),
};

export const Semantic: Story = {
  name: 'decorative={false}',
  render: () => <Separator decorative={false} className="my-3" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  },
};
