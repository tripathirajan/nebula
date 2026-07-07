import { expect, within } from '@storybook/test';

import { UrlInput } from './url-input';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UrlInput> = {
  title: 'Styleless/UrlInput',
  component: UrlInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'website', placeholder: 'https://example.com' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByPlaceholderText('https://example.com')).toHaveAttribute('type', 'url');
  },
};
