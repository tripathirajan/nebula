import { expect, userEvent, within } from '@storybook/test';

import { Toggle } from './toggle';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'aria-label': 'Bold', children: 'B' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Bold' });

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  },
};

export const DefaultPressed: Story = {
  args: { 'aria-label': 'Bold', children: 'B', defaultPressed: true },
};

export const Disabled: Story = {
  args: { 'aria-label': 'Bold', children: 'B', disabled: true },
};
