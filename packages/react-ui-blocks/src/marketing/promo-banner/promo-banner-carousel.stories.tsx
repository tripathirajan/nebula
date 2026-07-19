import { Image } from '@nebula-lab/primitives/image';
import { expect, fireEvent, within } from '@storybook/test';

import { PromoBannerCarousel } from './promo-banner-carousel';

import type { PromoBannerProps } from './promo-banner';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Marketing/PromoBannerCarousel',
  component: PromoBannerCarousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PromoBannerCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const banners: PromoBannerProps[] = [
  {
    logo: 'Acme Cloud',
    headline: 'More storage, up to 40% off',
    subheadline: 'Upgrade your plan this week only',
    badge: 'Ad',
    color: 'info',
    media: <Image src="https://placehold.co/200x260" alt="" />,
  },
  {
    logo: 'Fitly',
    headline: 'Your first month is free',
    subheadline: 'Cancel anytime, no card required',
    badge: 'Ad',
    color: 'success',
    media: <Image src="https://placehold.co/200x260" alt="" />,
  },
  {
    logo: 'Nimbus Travel',
    headline: 'Flights from $59, book today',
    subheadline: 'Limited seats on popular routes',
    badge: 'Ad',
    color: 'warning',
    media: <Image src="https://placehold.co/200x260" alt="" />,
  },
];

export const Default: Story = {
  name: 'One banner at a time (swipe or scroll to navigate)',
  args: { banners, 'aria-label': 'Promotions' },
  decorators: [(Story) => <div className="mx-auto w-full max-w-2xl"><Story /></div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'More storage, up to 40% off' })).toBeInTheDocument();

    const active = canvas
      .getByRole('heading', { name: 'More storage, up to 40% off' })
      .closest('[role="group"]')!;
    fireEvent.pointerDown(active, { pointerId: 1, clientX: 200, clientY: 0 });
    fireEvent.pointerMove(active, { pointerId: 1, clientX: 100, clientY: 0 });
    fireEvent.pointerUp(active, { pointerId: 1, clientX: 100, clientY: 0 });

    await expect(
      canvas.getByRole('heading', { name: 'Your first month is free' }).closest('[role="group"]'),
    ).toHaveAttribute('data-state', 'active');
  },
};

export const SmallScreen: Story = {
  name: 'Mobile viewport (responsive aspect ratio + text sizing)',
  args: { banners, 'aria-label': 'Promotions' },
  // Tailwind's `sm:`/`md:` prefixes respond to the real viewport, not a
  // wrapper `<div>`'s width — a narrow parent inside a wide browser window
  // never triggers them, so this uses Storybook's own viewport addon
  // (already wired to this repo's desktop/tablet/mobile globals) to shrink
  // the actual canvas instead, matching how it'll really behave on a phone.
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
