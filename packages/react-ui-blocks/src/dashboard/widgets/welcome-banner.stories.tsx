import { WelcomeBanner } from './welcome-banner';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Widgets/Welcome Banner',
  component: WelcomeBanner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof WelcomeBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Welcome back, Jane 👋',
    description: "Here's what's happening with your projects today.",
    action: { label: 'View reports', href: '#reports' },
  },
};

export const WithIllustration: Story = {
  args: {
    title: 'Welcome back, Jane 👋',
    description: "Here's what's happening with your projects today.",
    action: { label: 'View reports', href: '#reports' },
    illustration: (
      <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden="true">
        <circle cx="48" cy="48" r="40" fill="var(--color-primary-content)" opacity="0.15" />
        <path
          d="M30 58 42 44l10 10 16-20"
          fill="none"
          stroke="var(--color-primary-content)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export const NoAction: Story = {
  args: { title: 'Welcome back, Jane 👋' },
};
