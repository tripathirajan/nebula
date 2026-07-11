import { Image } from '@nebula/primitives/image';
import { Badge, Button, Card, CardContent, Heading, Text } from '@nebula/react-ui';
import * as React from 'react';

import type { BadgeProps } from '@nebula/react-ui';

interface ProductCardProps {
  imageSrc: string;
  imageAlt: string;
  name: React.ReactNode;
  /** Pre-formatted, e.g. `"$49.00"` — this block has no currency-formatting opinion. */
  price: React.ReactNode;
  description?: React.ReactNode;
  badge?: { label: React.ReactNode; color?: BadgeProps['color'] };
  action?: { label?: React.ReactNode; onClick?: () => void };
  className?: string;
}

/**
 * A single product tile — image, name, price, optional description, an
 * optional status badge (e.g. "Sale"/"New") overlaid on the image, and an
 * optional CTA button. Built purely from `@nebula/react-ui`/
 * `@nebula/primitives` (no styled `Image` wrapper exists in `react-ui`
 * itself — see that package's `Image` doc comment — so this block reaches
 * one layer down for the bare primitive directly).
 *
 * @example
 * ```tsx
 * <ProductCard
 *   imageSrc="/products/sneaker.jpg"
 *   imageAlt="White low-top sneaker"
 *   name="Cloud Runner"
 *   price="$89.00"
 *   badge={{ label: 'Sale', color: 'danger' }}
 *   action={{ label: 'Add to cart', onClick: () => addToCart('sneaker-1') }}
 * />
 * ```
 */
function ProductCard(props: ProductCardProps) {
  const { imageSrc, imageAlt, name, price, description, badge, action, className } = props;

  return (
    <Card variant="elevation" elevation={1} className={className}>
      <div className="relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="aspect-square w-full rounded-t-[var(--radius-card)] object-cover"
        />
        {badge ? (
          <Badge color={badge.color ?? 'accent'} className="absolute right-2 top-2">
            {badge.label}
          </Badge>
        ) : null}
      </div>
      <CardContent className="flex flex-col gap-2">
        <Heading as="h3" level={4}>
          {name}
        </Heading>
        <Text className="text-lg font-semibold">{price}</Text>
        {description ? <Text className="opacity-70">{description}</Text> : null}
        {action ? (
          <Button color="primary" className="mt-2 w-full" onClick={action.onClick}>
            {action.label ?? 'Add to cart'}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { ProductCard };
export type { ProductCardProps };
