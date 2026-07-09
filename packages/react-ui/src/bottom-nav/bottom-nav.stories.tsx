import { expect, within } from '@storybook/test';

import { BottomNav } from './bottom-nav';
import { BottomNavItem } from './bottom-nav-item';

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

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx={11} cy={11} r={8} />
    <path d="m21 21-4.3-4.3" />
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

const meta: Meta<typeof BottomNav> = {
  title: 'React UI/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', height: 200 }}>
      <BottomNav className="absolute">
        <BottomNavItem icon={<HomeIcon />} label="Home" href="#" active />
        <BottomNavItem icon={<SearchIcon />} label="Search" href="#" />
        <BottomNavItem icon={<BellIcon />} label="Alerts" href="#" />
        <BottomNavItem icon={<UserIcon />} label="Profile" href="#" />
      </BottomNav>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'Search' })).not.toHaveAttribute('aria-current');
  },
};
