import { Container } from './container';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Container> = {
  title: 'React UI/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Container size="md" className="bg-[var(--color-base-200)] py-6">
      <div className="rounded-[var(--radius-selector)] bg-[var(--color-base-100)] p-4">
        Capped at `size=&quot;md&quot;`, centered, with responsive edge padding.
      </div>
    </Container>
  ),
};
