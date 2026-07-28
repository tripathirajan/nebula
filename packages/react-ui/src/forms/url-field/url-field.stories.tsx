import { expect, within } from '@storybook/test';

import { UrlField } from './url-field';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/UrlField',
  component: UrlField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof UrlField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'website', placeholder: 'https://example.com', 'aria-label': 'Website' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toHaveAttribute('type', 'url');
  },
};
