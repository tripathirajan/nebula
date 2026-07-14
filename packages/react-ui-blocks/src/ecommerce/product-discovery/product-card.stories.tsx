import { useState } from 'react';

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

function FullEcommerceDemo() {
  const [favorited, setFavorited] = useState(false);
  return (
    <div style={{ width: 280 }}>
      <ProductCard
        imageSrc="https://placehold.co/400x400"
        imageAlt="Street Pulse running shoe on a plain background"
        name="Street Pulse"
        price="$71.20"
        originalPrice="$89.00"
        rating={4.5}
        reviewCount={128}
        badge={{ label: 'Sale', color: 'danger' }}
        favorited={favorited}
        onFavorite={() => setFavorited((prev) => !prev)}
        action={{ label: 'Add to cart' }}
      />
    </div>
  );
}

export const FullEcommerceCard: Story = {
  name: 'Full ecommerce card (rating + discount + wishlist)',
  args: {
    imageSrc: 'https://placehold.co/400x400',
    imageAlt: 'Street Pulse running shoe on a plain background',
    name: 'Street Pulse',
    price: '$71.20',
  },
  render: () => <FullEcommerceDemo />,
};
