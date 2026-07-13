import { ProductGallery } from './product-gallery';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Ecommerce/Product Discovery/Product Gallery',
  component: ProductGallery,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ProductGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

const images = [
  { src: 'https://placehold.co/600x600', alt: 'White low-top sneaker, side view' },
  { src: 'https://placehold.co/600x600/e5e5e5/333', alt: 'White low-top sneaker, top view' },
  { src: 'https://placehold.co/600x600/d4d4d4/333', alt: 'White low-top sneaker, sole view' },
];

export const Default: Story = {
  args: { images },
  render: (args) => (
    <div style={{ width: 420 }}>
      <ProductGallery {...args} />
    </div>
  ),
};

export const SingleImage: Story = {
  name: 'Single image (no thumbnails or nav)',
  args: { images: images.slice(0, 1) },
  render: (args) => (
    <div style={{ width: 420 }}>
      <ProductGallery {...args} />
    </div>
  ),
};
