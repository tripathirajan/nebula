import { expect, userEvent, within } from '@storybook/test';

import { SaasAppHeader } from './saas-app-header';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Navigation/Headers/Saas App Header',
  component: SaasAppHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SaasAppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: 'Acme',
    navLinks: [
      { label: 'Overview', href: '#overview', active: true },
      { label: 'Reports', href: '#reports' },
      { label: 'Settings', href: '#settings' },
    ],
    user: { name: 'Jane Cooper' },
  },
};

export const WithAvatarImage: Story = {
  args: {
    brand: 'Acme',
    navLinks: [
      { label: 'Overview', href: '#overview', active: true },
      { label: 'Reports', href: '#reports' },
    ],
    user: { name: 'Jane Cooper', avatarSrc: 'https://i.pravatar.cc/80?img=1' },
    userMenuItems: [
      { label: 'Settings' },
      { label: 'Sign out', separatorBefore: true },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: 'Jane Cooper account menu' });
    await userEvent.click(trigger);
    const menu = await within(document.body).findByRole('menu');
    await expect(menu).toBeInTheDocument();
    const signOut = await within(document.body).findByRole('menuitem', { name: 'Sign out' });
    await userEvent.click(signOut);
    await expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument();
  },
};
