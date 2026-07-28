import { Box } from './box';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Box> = {
  title: 'React UI/Layout/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box className="rounded-[var(--radius-box)] border border-[var(--card-border)] bg-[var(--color-base-100)] p-4">
      Plain container, styled entirely via className.
    </Box>
  ),
};

export const Polymorphic: Story = {
  name: 'Polymorphic (as="section")',
  render: () => (
    <Box as="section" aria-label="Summary" className="rounded-[var(--radius-box)] border border-[var(--card-border)] p-4">
      Renders a &lt;section&gt; instead of a &lt;div&gt;.
    </Box>
  ),
};
