import { Logo } from '@nebula-lab/react-ui/logo';

import { LoginForm } from '../sign-in/login-form';

import { AuthSplitLayout } from './auth-split-layout';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Authentication/AuthSplitLayout',
  component: AuthSplitLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AuthSplitLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Composed with `LoginForm` — the actual intended usage. Resize the canvas below `lg` (or use the toolbar's Mobile preset) to see the left panel disappear and the form take the full screen, centered. */
export const Default: Story = {
  args: {
    logo: (
      <div className="flex items-center gap-2 text-[var(--color-base-content)]">
        <Logo size={28} className="text-[var(--color-primary)]" />
        <span className="text-lg font-bold">Nebula</span>
      </div>
    ),
    title: 'Hi, welcome back',
    description: 'More effectively with optimized workflows.',
    illustration: (
      <div
        aria-hidden="true"
        className="flex h-40 w-40 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-20 w-20">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m8 12 3 3 6-6" />
        </svg>
      </div>
    ),
    topRightSlot: (
      <a className="text-sm text-[var(--color-base-content)]/70" href="#help">
        Need help?
      </a>
    ),
    children: (
      <LoginForm
        card={false}
        onSubmit={(values) => console.log(values)}
        footer={
          <a className="text-sm text-[var(--color-primary)]" href="#forgot-password">
            Forgot password?
          </a>
        }
      />
    ),
  },
};
