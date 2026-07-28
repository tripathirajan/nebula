import { Stack } from './stack';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Stack> = {
  title: 'React UI/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stack gap={8} className="w-48">
      <div className="rounded-[var(--radius-selector)] bg-[var(--color-base-200)] px-3 py-2">One</div>
      <div className="rounded-[var(--radius-selector)] bg-[var(--color-base-200)] px-3 py-2">Two</div>
      <div className="rounded-[var(--radius-selector)] bg-[var(--color-base-200)] px-3 py-2">Three</div>
    </Stack>
  ),
};
