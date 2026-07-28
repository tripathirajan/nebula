import { Flex } from './flex';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Flex> = {
  title: 'React UI/Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function Swatch(props: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-selector)] bg-[var(--color-primary)] px-4 py-2 text-[var(--color-primary-content)]">
      {props.children}
    </div>
  );
}

export const Row: Story = {
  render: () => (
    <Flex gap={12}>
      <Swatch>One</Swatch>
      <Swatch>Two</Swatch>
      <Swatch>Three</Swatch>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" gap={8}>
      <Swatch>One</Swatch>
      <Swatch>Two</Swatch>
    </Flex>
  ),
};

export const SpaceBetween: Story = {
  render: () => (
    <Flex justify="between" align="center" className="w-64">
      <Swatch>Left</Swatch>
      <Swatch>Right</Swatch>
    </Flex>
  ),
};
