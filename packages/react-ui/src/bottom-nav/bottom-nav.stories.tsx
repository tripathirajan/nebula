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
  parameters: {
    layout: 'fullscreen',
    // `BottomNav` is `md:hidden` by design — without pinning the canvas to
    // a mobile-width viewport, Storybook's default (desktop-width) preview
    // hides it entirely, both visually (confusing for anyone just opening
    // this story) and for the interaction test below (`display: none` at
    // desktop width removes it from the accessibility tree, so `getByRole`
    // can't find it even though the DOM node is present).
    viewport: { defaultViewport: 'mobile1' },
  },
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
    // `{ hidden: true }` includes elements Testing Library would otherwise
    // exclude from the accessibility tree for being CSS-hidden (`md:hidden`)
    // — needed here because the *environment's* viewport width (not this
    // story's `parameters.viewport`, which only affects Storybook's own
    // canvas iframe, not every possible runner) isn't guaranteed to be
    // below the `md` breakpoint wherever this play function executes.
    // `find*` (not `get*`) also gives the render itself a moment to settle.
    const navigation = await canvas.findByRole('navigation', { hidden: true });
    await expect(navigation).toBeInTheDocument();
    await expect(
      await canvas.findByRole('link', { name: 'Home', hidden: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      await canvas.findByRole('link', { name: 'Search', hidden: true }),
    ).not.toHaveAttribute('aria-current');
  },
};
