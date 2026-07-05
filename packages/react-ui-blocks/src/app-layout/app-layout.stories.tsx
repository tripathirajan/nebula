import { expect, within } from '@storybook/test';

import { AppLayout } from './app-layout';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/AppLayout',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'nebula',
    children: (
      <div className="p-6 text-sm">
        Page content renders here, inside <code>{'<Primitive as="main">'}</code>.
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('banner')).toBeInTheDocument();
    await expect(canvas.getByRole('main')).toBeInTheDocument();
    await expect(canvas.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
  },
};

export const WithoutHeader: Story = {
  args: {
    hideHeader: true,
    children: <div className="p-6 text-sm">No header, no ThemeSwitcher.</div>,
  },
};
