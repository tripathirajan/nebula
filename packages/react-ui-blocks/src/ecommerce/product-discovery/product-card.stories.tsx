import { ProductCard } from './product-card';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Ecommerce/Product Discovery/Product Card',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSrc: 'https://placehold.co/400x400',
    imageAlt: 'White low-top sneaker on a plain background',
    name: 'Cloud Runner',
    price: '$89.00',
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <ProductCard {...args} />
    </div>
  ),
};

export const OnSale: Story = {
  args: {
    imageSrc: 'https://placehold.co/400x400',
    imageAlt: 'Charcoal knit sneaker on a plain background',
    name: 'Trail Glide',
    price: '$64.00',
    description: 'Breathable knit upper, recycled foam midsole.',
    badge: { label: 'Sale', color: 'danger' },
    action: { label: 'Add to cart' },
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <ProductCard {...args} />
    </div>
  ),
};
