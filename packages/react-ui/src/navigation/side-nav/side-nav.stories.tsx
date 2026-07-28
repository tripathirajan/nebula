import { expect, within } from '@storybook/test';

import { Sidebar } from '../sidebar';

import { SideNav } from './side-nav';
import { SideNavGroup } from './side-nav-group';
import { SideNavItem } from './side-nav-item';

import type { Meta, StoryObj } from '@storybook/react';

const HomeIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

const UserIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx={12} cy={7} r={4} />
  </svg>
);

const BellIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const meta: Meta<typeof SideNav> = {
  title: 'React UI/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ height: 400 }} className="flex">
      <Sidebar>
        <SideNav>
          <SideNavItem icon={<HomeIcon />} label="Home" href="#" active />
          <SideNavGroup label="Settings">
            <SideNavItem icon={<UserIcon />} label="Profile" href="#" />
            <SideNavItem icon={<BellIcon />} label="Notifications" href="#" />
          </SideNavGroup>
        </SideNav>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(await canvas.findByRole('link', { name: 'Profile' })).not.toHaveAttribute(
      'aria-current',
    );
    await expect(await canvas.findByRole('group', { name: 'Settings' })).toBeInTheDocument();
  },
};

export const Collapsed: Story = {
  render: () => (
    <div style={{ height: 400 }} className="flex">
      <Sidebar collapsed>
        <SideNav>
          <SideNavItem icon={<HomeIcon />} label="Home" href="#" active collapsed />
          <SideNavGroup label="Settings" collapsed>
            <SideNavItem icon={<UserIcon />} label="Profile" href="#" collapsed />
          </SideNavGroup>
        </SideNav>
      </Sidebar>
    </div>
  ),
};
