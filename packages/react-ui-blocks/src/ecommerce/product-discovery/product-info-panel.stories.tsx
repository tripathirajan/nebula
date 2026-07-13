import { ProductInfoPanel } from './product-info-panel';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Ecommerce/Product Discovery/Product Info Panel',
  component: ProductInfoPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProductInfoPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: { label: 'Sale', color: 'danger' },
    name: 'Cloud Runner',
    rating: 4.5,
    reviewCount: 128,
    price: '$89.00',
    originalPrice: '$110.00',
    description:
      'A breathable knit upper over a recycled foam midsole — built for everyday miles, not just race day.',
    colors: [
      { value: 'white', label: 'White', swatch: '#ffffff' },
      { value: 'black', label: 'Black', swatch: '#111111' },
      { value: 'sage', label: 'Sage', swatch: '#87a08a' },
    ],
    defaultColor: 'white',
    sizes: [
      { value: '7', label: '7' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
      { value: '10', label: '10' },
      { value: '11', label: '11', disabled: true },
    ],
    defaultSize: '9',
    onSizeChartClick: () => {},
    availability: 'In stock',
    maxQuantity: 5,
    primaryAction: { label: 'Add to cart' },
    secondaryAction: { label: 'Buy now' },
    onCompare: () => {},
    onFavorite: () => {},
    onShare: () => {},
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ProductInfoPanel {...args} />
    </div>
  ),
};

export const Minimal: Story = {
  name: 'Minimal (no rating, variants, or reviews)',
  args: {
    name: 'Cloud Runner',
    price: '$89.00',
    primaryAction: { label: 'Add to cart' },
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ProductInfoPanel {...args} />
    </div>
  ),
};
