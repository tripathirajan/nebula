import { Center } from './center';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Center> = {
  title: 'React UI/Layout/Center',
  component: Center,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Center className="h-40 rounded-[var(--radius-selector)] bg-[var(--color-base-200)]">
      <span className="rounded-[var(--radius-selector)] bg-[var(--color-primary)] px-4 py-2 text-[var(--color-primary-content)]">
        Centered
      </span>
    </Center>
  ),
};
