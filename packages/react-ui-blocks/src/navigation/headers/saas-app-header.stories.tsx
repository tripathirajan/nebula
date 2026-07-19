import { expect, userEvent, within } from '@storybook/test';

import { SaasAppHeader } from './saas-app-header';

import type { Meta, StoryObj } from '@storybook/react';

const LogoMark = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <rect width="24" height="24" rx="6" fill="var(--color-primary)" />
    <path d="M7 15.5 12 7l5 8.5H7Z" fill="var(--color-primary-content)" />
  </svg>
);

const navLinks = [
  { label: 'Overview', href: '#overview', active: true },
  {
    label: 'Products',
    items: [
      { label: 'Analytics', description: 'Usage and funnels', href: '#analytics' },
      { label: 'Billing', description: 'Plans and invoices', href: '#billing' },
      { label: 'Team', description: 'Members and roles', href: '#team' },
    ],
  },
  { label: 'Reports', href: '#reports' },
];

const notifications = [
  { id: '1', title: 'New comment', description: 'Jane replied to your ticket', timestamp: '2m ago', read: false },
  { id: '2', title: 'Deploy finished', description: 'main deployed to production', timestamp: '1h ago', read: false },
  { id: '3', title: 'Weekly summary', description: 'Your usage report is ready', timestamp: 'Yesterday', read: true },
];

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
    logo: <LogoMark />,
    brand: 'Acme',
    navLinks,
    user: { name: 'Jane Cooper', role: 'Admin' },
  },
};

export const WithNotificationsAndMenu: Story = {
  args: {
    logo: <LogoMark />,
    brand: 'Acme',
    navLinks,
    notifications,
    user: { name: 'Jane Cooper', role: 'Admin', avatarSrc: 'https://i.pravatar.cc/80?img=1' },
    userMenuItems: [{ label: 'Settings' }, { label: 'Sign out', separatorBefore: true }],
  },
  parameters: {
    // The desktop NavigationMenu is `hidden md:block` — without pinning the
    // canvas to a width ≥ the `md` breakpoint, this play function's
    // "Products" trigger query fails wherever the ambient Storybook canvas
    // happens to be narrower (same class of issue BottomNav's story
    // documents for its own `mobile` pin, just the opposite direction).
    viewport: {
      viewports: { desktopWide: { name: 'Desktop', styles: { width: '1280px', height: '800px' }, type: 'desktop' } },
      defaultViewport: 'desktopWide',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Notification bell opens a panel listing unread + read items.
    const bellTrigger = await canvas.findByRole('button', { name: /Notifications/ });
    await userEvent.click(bellTrigger);
    await expect(await within(document.body).findByText('New comment')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');

    // Products nav trigger opens its sub-menu. `{ hidden: true }` guards
    // against a runner whose environment width isn't guaranteed to respect
    // this story's own `parameters.viewport` (see BottomNav's story for the
    // same defensive pattern).
    const productsTrigger = await canvas.findByRole('button', { name: 'Products', hidden: true });
    await userEvent.hover(productsTrigger);
    await expect(await within(document.body).findByText('Analytics')).toBeInTheDocument();
  },
};

export const Glass: Story = {
  name: 'Glass (scroll-reactive blur)',
  args: {
    logo: <LogoMark />,
    brand: 'Acme',
    navLinks,
    user: { name: 'Jane Cooper', role: 'Admin' },
    glass: true,
  },
  render: (args) => (
    <div>
      <SaasAppHeader {...args} />
      <div
        className="flex h-[70vh] items-end justify-center bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] p-10 text-center text-[var(--color-primary-content)]"
        style={{ marginTop: '-56px' }}
      >
        <p className="max-w-md pb-10 text-2xl font-bold">
          Scroll down — the header above starts transparent, then gains a frosted blur.
        </p>
      </div>
      <div className="mx-auto max-w-2xl space-y-4 p-10">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="text-sm opacity-70">
            Page content paragraph {index + 1}. Scroll the page to see the header pick up its frosted-glass
            surface once it clears the hero above.
          </p>
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('banner');
    expect(header).not.toHaveClass('backdrop-blur-md');

    canvasElement.ownerDocument.defaultView?.scrollTo(0, 400);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await expect(header).toHaveClass('backdrop-blur-md');
  },
};

export const MobileMenu: Story = {
  args: {
    logo: <LogoMark />,
    brand: 'Acme',
    navLinks,
    user: { name: 'Jane Cooper', role: 'Admin' },
  },
  parameters: { viewport: { defaultViewport: 'mobile' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuTrigger = await canvas.findByRole('button', { name: 'Open navigation menu', hidden: true });
    await userEvent.click(menuTrigger);

    // `findByText` (unlike `findByRole`) doesn't exclude CSS-hidden elements
    // from its match, so an unscoped query for "Overview" matches both the
    // mobile Sheet's own link AND the desktop NavigationMenu's `hidden
    // md:block` copy, which is still present in the DOM at this viewport —
    // scope to the open Sheet (`role="dialog"`) to disambiguate.
    const sheet = await within(document.body).findByRole('dialog');
    await expect(within(sheet).getByText('Overview')).toBeInTheDocument();
  },
};
