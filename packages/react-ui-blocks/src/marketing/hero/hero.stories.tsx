import { Image } from '@nebula/primitives/image';

import { Hero } from './hero';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Marketing/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: 'New',
    headline: 'Ship your design system faster',
    subheadline: 'Composable, accessible, themeable UI blocks — build once, reuse everywhere.',
    primaryAction: { label: 'Get started', href: '#get-started' },
  },
};

export const WithMedia: Story = {
  args: {
    eyebrow: 'Now in beta',
    headline: 'A blocks library that scales with you',
    subheadline: 'From a single hero section to a full application shell.',
    primaryAction: { label: 'Get started', href: '#get-started' },
    secondaryAction: { label: 'View on GitHub', href: '#github' },
    media: (
      <Image
        src="https://placehold.co/640x420"
        alt=""
        className="w-full rounded-[var(--radius-card)] shadow-lg"
      />
    ),
  },
};
