import { cn } from '@nebula/primitives/cn';
import { Image } from '@nebula/primitives/image';
import { Badge } from '@nebula/react-ui/badge';
import { Button } from '@nebula/react-ui/button';
import { Card, CardContent } from '@nebula/react-ui/card';
import { Heading } from '@nebula/react-ui/heading';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

import type { BadgeProps } from '@nebula/react-ui/badge';

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
    <Card variant="elevation" elevation={1} className={cn('overflow-hidden', className)}>
      <div className="relative">
        <Image src={imageSrc} alt={imageAlt} className="aspect-square w-full object-cover" />
        {badge ? (
          // `--radius-card` is a large pill radius (2rem) — an inset this
          // close to the corner would sit inside the curve and visually
          // clip against it (the same "weird padding" class of issue
          // `tokens/primitive.ts`'s `--radius-popover` comment documents
          // for panels); `top-4 right-4` clears it.
          <Badge color={badge.color ?? 'accent'} className="absolute right-4 top-4">
            {badge.label}
          </Badge>
        ) : null}
      </div>
      <CardContent className="flex flex-col gap-1.5">
        <Heading as="h3" level={6} className="truncate">
          {name}
        </Heading>
        <Text className="text-base font-bold">{price}</Text>
        {description ? <Text className="text-sm opacity-70">{description}</Text> : null}
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
