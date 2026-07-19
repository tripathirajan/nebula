import { Image } from '@nebula/primitives/image';

import { PromoBanner } from './promo-banner';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Marketing/PromoBanner',
  component: PromoBanner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PromoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo: 'Acme Cloud',
    headline: 'More storage, up to 40% off',
    subheadline: 'Upgrade your plan this week only',
    badge: 'Ad',
    color: 'info',
    media: <Image src="https://placehold.co/200x260" alt="" />,
  },
  decorators: [(Story) => <div className="aspect-[2/1] w-full max-w-xl"><Story /></div>],
};

export const NoMedia: Story = {
  name: 'Without a media slot',
  args: {
    logo: 'Fitly',
    headline: 'Your first month is free',
    subheadline: 'Cancel anytime, no card required',
    color: 'success',
  },
  decorators: [(Story) => <div className="aspect-[2/1] w-full max-w-xl"><Story /></div>],
};

export const Colors: Story = {
  args: { headline: 'Colors' },
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {(['primary', 'accent', 'warning', 'danger'] as const).map((color) => (
        <div key={color} className="aspect-[2/1]">
          <PromoBanner
            headline={`${color[0]!.toUpperCase()}${color.slice(1)} banner`}
            subheadline="Same behavior, any semantic color"
            color={color}
            media={<Image src="https://placehold.co/200x260" alt="" />}
          />
        </div>
      ))}
    </div>
  ),
};
