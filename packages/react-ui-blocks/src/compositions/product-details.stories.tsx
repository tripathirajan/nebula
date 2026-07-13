import { Link } from '@nebula/primitives/link';
import { Badge } from '@nebula/react-ui/badge';
import { Card, CardContent } from '@nebula/react-ui/card';
import { Heading } from '@nebula/react-ui/heading';
import { Tab, TabList, TabPanel, Tabs } from '@nebula/react-ui/tabs';
import { Text } from '@nebula/react-ui/text';

import { ReviewsList } from '../dashboard/widgets/reviews-list';
import { ProductGallery } from '../ecommerce/product-discovery/product-gallery';
import { ProductInfoPanel } from '../ecommerce/product-discovery/product-info-panel';

import type { Meta, StoryObj } from '@storybook/react';

// Assembled-page story — see saas-dashboard-home.stories.tsx's header
// comment for the "Assembled Page" pattern (BLOCKS_ARCHITECTURE.md §9). No
// component of its own; ProductGallery/ProductInfoPanel are the only new
// pieces (built for this composition), everything else already shipped.
const meta = {
  title: 'Blocks/Compositions/Product Details',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const images = [
  { src: 'https://placehold.co/700x700', alt: 'Cloud Runner sneaker, side view' },
  { src: 'https://placehold.co/700x700/e5e5e5/333', alt: 'Cloud Runner sneaker, top view' },
  { src: 'https://placehold.co/700x700/d4d4d4/333', alt: 'Cloud Runner sneaker, sole view' },
];

const reviews = [
  {
    id: '1',
    author: 'Jayvion Simon',
    rating: 5,
    date: 'July 2, 2026',
    content: 'True to size and genuinely comfortable out of the box — no break-in period needed.',
  },
  {
    id: '2',
    author: 'Ariana Lang',
    rating: 4,
    date: 'June 18, 2026',
    content: 'Great everyday shoe. Docked one star only because the white colorway shows dirt fast.',
  },
];

const specifications = [
  { label: 'Upper material', value: 'Recycled knit mesh' },
  { label: 'Midsole', value: 'Molded EVA foam' },
  { label: 'Outsole', value: 'Rubber, multi-directional tread' },
  { label: 'Weight', value: '9.8 oz (men’s size 9)' },
  { label: 'Origin', value: 'Vietnam' },
];

function ProductDetailsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-base-200)] p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link as="button" type="button" className="text-sm">
            &larr; Back to products
          </Link>
          <Badge color="success">In stock</Badge>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProductGallery images={images} />
          <ProductInfoPanel
            badge={{ label: 'Sale', color: 'danger' }}
            name="Cloud Runner"
            rating={4.5}
            reviewCount={reviews.length}
            price="$89.00"
            originalPrice="$110.00"
            description="A breathable knit upper over a recycled foam midsole — built for everyday miles, not just race day."
            colors={[
              { value: 'white', label: 'White', swatch: '#ffffff' },
              { value: 'black', label: 'Black', swatch: '#111111' },
              { value: 'sage', label: 'Sage', swatch: '#87a08a' },
            ]}
            defaultColor="white"
            sizes={[
              { value: '7', label: '7' },
              { value: '8', label: '8' },
              { value: '9', label: '9' },
              { value: '10', label: '10' },
              { value: '11', label: '11', disabled: true },
            ]}
            defaultSize="9"
            onSizeChartClick={() => {}}
            availability="In stock"
            maxQuantity={5}
            primaryAction={{ label: 'Add to cart' }}
            secondaryAction={{ label: 'Buy now' }}
            onCompare={() => {}}
            onFavorite={() => {}}
            onShare={() => {}}
          />
        </div>

        <Card>
          <CardContent>
            <Tabs defaultValue="description">
              <TabList aria-label="Product details sections">
                <Tab value="description">Description</Tab>
                <Tab value="reviews">Reviews ({reviews.length})</Tab>
                <Tab value="specifications">Specifications</Tab>
              </TabList>
              <TabPanel value="description" className="pt-4">
                <Heading as="h3" level={6} className="mb-2">
                  Built for the long run
                </Heading>
                <Text className="text-sm opacity-80">
                  The Cloud Runner pairs a breathable recycled-knit upper with a molded EVA midsole tuned for
                  everyday mileage. A multi-directional rubber outsole keeps grip consistent on both road and
                  light trail, and an internal heel counter locks the foot in place without adding stiffness.
                </Text>
              </TabPanel>
              <TabPanel value="reviews" className="pt-4">
                <ReviewsList reviews={reviews} />
              </TabPanel>
              <TabPanel value="specifications" className="pt-4">
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {specifications.map((spec) => (
                    <div key={spec.label} className="flex justify-between border-b border-[var(--card-border)] pb-2">
                      <dt className="text-sm opacity-70">{spec.label}</dt>
                      <dd className="text-sm font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </TabPanel>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <ProductDetailsPage />,
};
