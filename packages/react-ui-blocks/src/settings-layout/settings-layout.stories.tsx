import { SettingsLayout } from './settings-layout';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/SettingsLayout',
  component: SettingsLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SettingsLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Settings',
    sidebar: (
      <nav className="flex flex-col gap-2 p-4 text-sm">
        <a className="rounded px-3 py-2 hover:bg-[var(--color-base-200)]" href="#">
          Profile
        </a>
        <a className="rounded px-3 py-2 hover:bg-[var(--color-base-200)]" href="#">
          Security
        </a>
        <a className="rounded px-3 py-2 hover:bg-[var(--color-base-200)]" href="#">
          Billing
        </a>
      </nav>
    ),
    children: (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-[var(--color-base-content)]/80">
          Settings content is centered in a narrow panel for easier scanning.
        </p>
      </div>
    ),
  },
};
