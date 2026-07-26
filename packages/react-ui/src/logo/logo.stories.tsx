import { Logo } from './logo';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Fills with `currentColor` — set text color to theme it, e.g. `text-[var(--color-base-content)]` (already light/dark aware) or a fixed brand color.',
      },
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 48 },
};

/** Following the page's own theme-aware text color — the same mark works in both themes with zero extra markup. */
export const ThemeAware: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div
        className="flex items-center justify-center rounded-lg p-6"
        style={{ background: 'var(--color-base-100)' }}
      >
        <Logo size={48} className="text-[var(--color-base-content)]" />
      </div>
      <div className="flex items-center justify-center rounded-lg bg-[#141a21] p-6">
        <Logo size={48} className="text-white" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 text-[var(--color-base-content)]">
      <Logo size={16} />
      <Logo size={24} />
      <Logo size={32} />
      <Logo size={48} />
      <Logo size={64} />
    </div>
  ),
};

/** Paired with the wordmark — the common "logo + name" lockup, e.g. for `AuthSplitLayout`'s `logo` slot. */
export const WithWordmark: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-[var(--color-base-content)]">
      <Logo size={28} className="text-[var(--color-primary)]" />
      <span className="text-lg font-bold">Nebula</span>
    </div>
  ),
};
