import { HStack } from './hstack';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof HStack> = {
  title: 'React UI/Layout/HStack',
  component: HStack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HStack gap={8}>
      <div className="rounded-[var(--radius-selector)] bg-[var(--color-base-200)] px-3 py-2">One</div>
      <div className="rounded-[var(--radius-selector)] bg-[var(--color-base-200)] px-3 py-2">Two</div>
    </HStack>
  ),
};
