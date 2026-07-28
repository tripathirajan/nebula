import { Button } from '../../button/button';
import { HStack } from '../hstack/hstack';

import { Spacer } from './spacer';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Spacer> = {
  title: 'React UI/Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HStack className="w-80 rounded-[var(--radius-selector)] border border-[var(--color-base-300)] p-3">
      <span>Logo</span>
      <Spacer />
      <Button size="sm">Sign out</Button>
    </HStack>
  ),
};
