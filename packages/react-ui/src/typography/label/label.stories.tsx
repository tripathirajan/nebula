import { expect, within } from '@storybook/test';

import { Label } from './label';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Label> = {
  title: 'React UI/Typography/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Label htmlFor="search-story">Search</Label>
      <input id="search-story" className="rounded-[var(--radius-field)] border border-[var(--input-border)] px-3 py-2" />
    </div>
  ),
};

export const Required: Story = {
  render: () => <Label htmlFor="email-story" required>Email</Label>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('(required)')).toBeInTheDocument();
  },
};
