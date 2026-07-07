import { expect, within } from '@storybook/test';

import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';

import { SplitButton } from './split-button';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SplitButton> = {
  title: 'Styleless/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SplitButton>
      <Button>Save</Button>
      <IconButton aria-label="More save options">▾</IconButton>
    </SplitButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'More save options' })).toBeInTheDocument();
  },
};
