import { expect, within } from '@storybook/test';

import { Spinner } from './spinner';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('Loading...');
  },
};

export const CustomLabel: Story = {
  args: { label: 'Loading search results' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading search results');
  },
};
