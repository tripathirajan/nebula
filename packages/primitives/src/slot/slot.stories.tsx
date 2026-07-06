import { expect, within } from '@storybook/test';

import { Primitive } from '../primitive/primitive';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * `Slot` has no visuals of its own — these stories demonstrate the `asChild`
 * pattern it powers via `Primitive`, which every styled Nebula component
 * (`Button`, etc.) is built on.
 */
const meta = {
  title: 'Primitives/Slot',
  component: Primitive,
  tags: ['autodocs'],
  args: { as: 'button' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Primitive>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RendersOwnTag: Story = {
  args: {
    children: 'Regular button',
  },
};

export const AsChildRendersAnchor: Story = {
  name: 'asChild renders the child element',
  args: {
    asChild: true,
    children: (
      <a href="#nebula" data-testid="slotted-anchor">
        Link styled as a button
      </a>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const anchor = canvas.getByTestId('slotted-anchor');
    await expect(anchor.tagName).toBe('A');
    await expect(anchor).toHaveAttribute('href', '#nebula');
  },
};
