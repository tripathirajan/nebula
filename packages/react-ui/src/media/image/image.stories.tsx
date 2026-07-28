import { Image } from './image';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Image> = {
  title: 'React UI/Media/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

// A data URI, not an external URL — stories shouldn't depend on network access.
const placeholderSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%23888'/%3E%3C/svg%3E";

export const Default: Story = {
  render: () => <Image src={placeholderSvg} alt="Placeholder" className="rounded-[var(--radius-card)]" />,
};
