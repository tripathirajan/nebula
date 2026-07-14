import { cn } from '@nebula/primitives/cn';
import { Image } from '@nebula/primitives/image';
import { Badge } from '@nebula/react-ui/badge';
import { Button } from '@nebula/react-ui/button';
import { Card, CardContent } from '@nebula/react-ui/card';
import { Heading } from '@nebula/react-ui/heading';
import { IconButton } from '@nebula/react-ui/icon-button';
import { StaticRating } from '@nebula/react-ui/static-rating';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

import type { BadgeProps } from '@nebula/react-ui/badge';

interface ProductCardProps {
  imageSrc: string;
  imageAlt: string;
  name: React.ReactNode;
  /** Pre-formatted, e.g. `"$49.00"` — this block has no currency-formatting opinion. */
  price: React.ReactNode;
  /** Pre-formatted pre-discount price, rendered struck through beside `price` — omit for a product with no discount. */
  originalPrice?: React.ReactNode;
  description?: React.ReactNode;
  /** 0-5 — omit to hide the rating row entirely (e.g. a brand-new product with no reviews yet). */
  rating?: number;
  reviewCount?: number;
  badge?: { label: React.ReactNode; color?: BadgeProps['color'] };
  /** Omit to hide the heart toggle entirely — a read-only product tile with no wishlist concept. */
  favorited?: boolean;
  onFavorite?: () => void;
  action?: { label?: React.ReactNode; onClick?: () => void };
  className?: string;
}

/**
 * A single product tile — image with a hover zoom, a wishlist heart toggle
 * and status badge overlaid on opposite corners, name, price (with an
 * optional struck-through original price for a discount), an optional
 * star-rating row, and a cart CTA. Built purely from `@nebula/react-ui`/
 * `@nebula/primitives` (no styled `Image` wrapper exists in `react-ui`
 * itself — see that package's `Image` doc comment — so this block reaches
 * one layer down for the bare primitive directly). The heart icon reuses
 * `ProductInfoPanel`'s exact same outline-heart SVG so a product's card and
 * detail-page favorite affordance read as the same control, not two
 * independently-drawn icons that happen to look similar.
 *
 * @example
 * ```tsx
 * <ProductCard
 *   imageSrc="/products/sneaker.jpg"
 *   imageAlt="White low-top sneaker"
 *   name="Cloud Runner"
 *   price="$71.20"
 *   originalPrice="$89.00"
 *   rating={4.5}
 *   reviewCount={128}
 *   badge={{ label: 'Sale', color: 'danger' }}
 *   favorited={isFavorited}
 *   onFavorite={() => toggleFavorite('sneaker-1')}
 *   action={{ label: 'Add to cart', onClick: () => addToCart('sneaker-1') }}
 * />
 * ```
 */
function ProductCard(props: ProductCardProps) {
  const {
    imageSrc,
    imageAlt,
    name,
    price,
    originalPrice,
    description,
    rating,
    reviewCount,
    badge,
    favorited,
    onFavorite,
    action,
    className,
  } = props;

  return (
    <Card variant="elevation" elevation={1} className={cn('group overflow-hidden', className)}>
      <div className="relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badge ? (
          // `--radius-card` is a large pill radius (2rem) — an inset this
          // close to the corner would sit inside the curve and visually
          // clip against it (the same "weird padding" class of issue
          // `tokens/primitive.ts`'s `--radius-popover` comment documents
          // for panels); `top-4 left-4` clears it, opposite corner from
          // the favorite toggle so the two overlays never collide.
          <Badge color={badge.color ?? 'accent'} className="absolute left-4 top-4">
            {badge.label}
          </Badge>
        ) : null}
        {onFavorite ? (
          <IconButton
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            size="sm"
            color={favorited ? 'danger' : 'neutral'}
            onClick={onFavorite}
            className="absolute right-3 top-3 bg-[var(--card-bg)]/90 shadow-sm backdrop-blur-sm hover:bg-[var(--card-bg)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill={favorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-4 w-4"
            >
              <path d="M12 21s-7-4.35-9.5-8.5C.8 9 2 5 5.5 4 8 3.3 10 4.5 12 7c2-2.5 4-3.7 6.5-3 3.5 1 4.7 5 3 8.5C19 16.65 12 21 12 21z" />
            </svg>
          </IconButton>
        ) : null}
      </div>
      <CardContent className="flex flex-col gap-1.5">
        <Heading as="h3" level={6} className="truncate">
          {name}
        </Heading>
        {rating !== undefined ? (
          <div className="flex items-center gap-1.5">
            <StaticRating value={rating} />
            {reviewCount !== undefined ? (
              <Text className="text-xs opacity-60">({reviewCount})</Text>
            ) : null}
          </div>
        ) : null}
        <div className="flex items-baseline gap-2">
          <Text className="text-base font-bold">{price}</Text>
          {originalPrice ? (
            <Text className="text-sm opacity-50 line-through">{originalPrice}</Text>
          ) : null}
        </div>
        {description ? <Text className="text-sm opacity-70">{description}</Text> : null}
        {action ? (
          <Button color="primary" className="mt-2 w-full gap-2" onClick={action.onClick}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx={9} cy={21} r={1} />
              <circle cx={20} cy={21} r={1} />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {action.label ?? 'Add to cart'}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { ProductCard };
export type { ProductCardProps };
