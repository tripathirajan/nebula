import { Link } from './link';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Link> = {
  title: 'React UI/Typography/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Link href="#pricing">See pricing</Link>,
};

export const External: Story = {
  render: () => (
    <Link href="https://example.com" external>
      External docs
    </Link>
  ),
};
