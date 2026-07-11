import { DashboardLayout } from './dashboard-layout';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/DashboardLayout',
  component: DashboardLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Acme Admin',
    sidebar: (
      <nav className="flex flex-col gap-2 p-4 text-sm">
        <a className="rounded px-3 py-2 hover:bg-[var(--color-base-200)]" href="#overview">
          Overview
        </a>
        <a className="rounded px-3 py-2 hover:bg-[var(--color-base-200)]" href="#reports">
          Reports
        </a>
        <a className="rounded px-3 py-2 hover:bg-[var(--color-base-200)]" href="#settings">
          Settings
        </a>
      </nav>
    ),
    children: (
      <div className="space-y-4 p-6">
        <h2 className="text-xl font-semibold">Welcome back</h2>
        <p className="max-w-2xl text-sm text-[var(--color-base-content)]/80">
          This layout gives your dashboard a persistent sidebar and content region.
        </p>
      </div>
    ),
  },
};
