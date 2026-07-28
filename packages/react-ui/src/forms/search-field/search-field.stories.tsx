import { expect, userEvent, within } from '@storybook/test';

import { SearchField } from './search-field';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Search…', 'aria-label': 'Search' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox');
    await userEvent.type(input, 'nebula');
    await expect(input).toHaveValue('nebula');
  },
};
