import { expect, within } from '@storybook/test';

import { SearchInput } from './search-input';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchInput> = {
  title: 'Styleless/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Search…' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByPlaceholderText('Search…')).toHaveAttribute('type', 'search');
  },
};
