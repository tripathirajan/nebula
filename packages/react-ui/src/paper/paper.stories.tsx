import { expect, within } from '@storybook/test';

import { Paper } from './paper';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Paper> = {
  title: 'React UI/Paper',
  component: Paper,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Paper className="w-80 p-4">Default elevated surface (elevation 1, no border).</Paper>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Default elevated surface/)).toBeInTheDocument();
  },
};

export const Outlined: Story = {
  name: 'variant="outlined"',
  render: () => (
    <Paper variant="outlined" className="w-80 p-4">
      Visible border, no shadow.
    </Paper>
  ),
};

export const Elevation0: Story = {
  name: 'elevation={0} (flat, no border)',
  render: () => (
    <Paper elevation={0} className="w-80 p-4">
      No shadow, no border — just the surface color.
    </Paper>
  ),
};

export const Elevation1: Story = {
  name: 'elevation={1}',
  render: () => (
    <Paper elevation={1} className="w-80 p-4">
      Subtle shadow.
    </Paper>
  ),
};

export const Elevation2: Story = {
  name: 'elevation={2}',
  render: () => (
    <Paper elevation={2} className="w-80 p-4">
      Medium shadow.
    </Paper>
  ),
};

export const Elevation3: Story = {
  name: 'elevation={3} (most elevated)',
  render: () => (
    <Paper elevation={3} className="w-80 p-4">
      Deepest shadow.
    </Paper>
  ),
};
