import { cn } from '@nebula/primitives/cn';
import { Link } from '@nebula/primitives/link';
import { Badge } from '@nebula/react-ui/badge';
import { Button } from '@nebula/react-ui/button';
import { Heading } from '@nebula/react-ui/heading';
import { IconButton } from '@nebula/react-ui/icon-button';
import { NumberInput, NumberInputDecrement, NumberInputField, NumberInputIncrement } from '@nebula/react-ui/number-input';
import { RadioGroup, RadioGroupItem } from '@nebula/react-ui/radio-group';
import { SegmentedControl, SegmentedControlItem } from '@nebula/react-ui/segmented-control';
import { StaticRating } from '@nebula/react-ui/static-rating';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

import type { BadgeProps } from '@nebula/react-ui/badge';

interface ProductColorOption {
  value: string;
  label: string;
  /** Any valid CSS color — swatches read this directly via inline `style`, same reasoning `DashboardOverview`'s per-metric `color` uses inline `style` over Tailwind classes: this is consumer-supplied, not one of Nebula's own fixed semantic tokens. */
  swatch: string;
}

interface ProductSizeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ProductInfoPanelAction {
  label: React.ReactNode;
  onClick?: () => void;
}

interface ProductInfoPanelProps {
  badge?: { label: React.ReactNode; color?: BadgeProps['color'] };
  name: React.ReactNode;
  /** 0-5. Omit along with `reviewCount` if this product has no reviews yet. */
  rating?: number;
  reviewCount?: number;
  /** Pre-formatted, e.g. `"$89.00"` — same no-currency-opinion convention `ProductCard.price` uses. */
  price: React.ReactNode;
  /** Pre-formatted strikethrough original price, e.g. for a sale. */
  originalPrice?: React.ReactNode;
  description?: React.ReactNode;
  colors?: ProductColorOption[];
  color?: string;
  defaultColor?: string;
  onColorChange?: (value: string) => void;
  sizes?: ProductSizeOption[];
  size?: string;
  defaultSize?: string;
  /** `undefined` is possible because `SegmentedControl` is built on a `type="single"` `ToggleGroup`, which allows deselecting the pressed item — same signature its own `onValueChange` has. */
  onSizeChange?: (value: string | undefined) => void;
  onSizeChartClick?: () => void;
  defaultQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number | undefined) => void;
  /** e.g. "In stock" / "Only 3 left" — this block has no stock-level opinion, just renders whatever's passed. */
  availability?: React.ReactNode;
  /** e.g. "Add to cart" — omit to hide the whole action row (a read-only product view). */
  primaryAction?: ProductInfoPanelAction;
  /** e.g. "Buy now", rendered as a secondary outline action beside `primaryAction`. */
  secondaryAction?: ProductInfoPanelAction;
  onCompare?: () => void;
  onFavorite?: () => void;
  favorited?: boolean;
  onShare?: () => void;
  className?: string;
}

/**
 * Product Detail's info panel (§2.16/§3.7 Product Detail → *Info Panel*,
 * *Size/Variant Selector*) — status badge, title, rating, price, colors,
 * sizes, quantity, availability, and an action row. Every selection
 * (`color`/`size`/quantity) supports the same controlled/uncontrolled split
 * `react-ui`'s own inputs use; a consumer with no variant state to track
 * can render this fully uncontrolled.
 *
 * Color swatches reuse `react-ui`'s own `RadioGroup`/`RadioGroupItem` (this
 * package only ever builds on `react-ui`/`primitives`, never reaches past
 * `react-ui` into `headless` directly) rather than a bespoke radio
 * implementation — `RadioGroupItem` always renders its own small indicator
 * dot before `children` (see its doc comment), which doesn't fit a
 * circular swatch, so that built-in dot is hidden via a `[&>span:first-
 * child]:hidden` arbitrary-child selector, leaving only this component's
 * own swatch circle visible; selection state still comes from the same
 * `data-state` attribute the hidden dot would have used, just read
 * directly off the item's own root instead of the `group-data-` indirection
 * `RadioGroupItem` uses internally. Size selection reuses `react-ui`'s
 * `SegmentedControl` as-is — a size picker is exactly a single-select
 * segmented control, no restyling needed.
 *
 * @example
 * ```tsx
 * <ProductInfoPanel
 *   name="Cloud Runner"
 *   rating={4.5}
 *   reviewCount={128}
 *   price="$89.00"
 *   originalPrice="$110.00"
 *   colors={[{ value: 'white', label: 'White', swatch: '#ffffff' }, { value: 'black', label: 'Black', swatch: '#111111' }]}
 *   sizes={[{ value: '8', label: '8' }, { value: '9', label: '9' }, { value: '10', label: '10', disabled: true }]}
 *   availability="In stock"
 *   primaryAction={{ label: 'Add to cart', onClick: () => addToCart() }}
 *   secondaryAction={{ label: 'Buy now', onClick: () => buyNow() }}
 * />
 * ```
 */
function ProductInfoPanel(props: ProductInfoPanelProps) {
  const {
    badge,
    name,
    rating,
    reviewCount,
    price,
    originalPrice,
    description,
    colors,
    color,
    defaultColor,
    onColorChange,
    sizes,
    size,
    defaultSize,
    onSizeChange,
    onSizeChartClick,
    defaultQuantity = 1,
    maxQuantity,
    onQuantityChange,
    availability,
    primaryAction,
    secondaryAction,
    onCompare,
    onFavorite,
    favorited,
    onShare,
    className,
  } = props;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {badge ? (
        <Badge color={badge.color ?? 'accent'} className="self-start">
          {badge.label}
        </Badge>
      ) : null}

      <Heading as="h1" level={3}>
        {name}
      </Heading>

      {rating !== undefined ? (
        <div className="flex items-center gap-2">
          <StaticRating value={rating} />
          {reviewCount !== undefined ? (
            <Text className="text-sm opacity-70">
              ({reviewCount} review{reviewCount === 1 ? '' : 's'})
            </Text>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-baseline gap-2">
        <Text className="text-2xl font-bold">{price}</Text>
        {originalPrice ? (
          <Text className="text-base opacity-50 line-through">{originalPrice}</Text>
        ) : null}
      </div>

      {description ? <Text className="text-sm opacity-80">{description}</Text> : null}

      {colors && colors.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Text className="text-sm font-medium">Color</Text>
          <RadioGroup
            value={color}
            defaultValue={defaultColor}
            onValueChange={onColorChange}
            orientation="horizontal"
            aria-label="Color"
            className="flex gap-2"
          >
            {colors.map((option) => (
              <RadioGroupItem
                key={option.value}
                value={option.value}
                aria-label={option.label}
                className="h-8 w-8 shrink-0 gap-0 rounded-full border-2 border-transparent p-0.5 transition-colors [&>span:first-child]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-base-content)] focus-visible:ring-offset-1 data-[state=checked]:border-[var(--color-primary)]"
              >
                <span
                  aria-hidden="true"
                  className="block h-full w-full rounded-full border border-[var(--card-border)]"
                  style={{ backgroundColor: option.swatch }}
                />
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>
      ) : null}

      {sizes && sizes.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium">Size</Text>
            {onSizeChartClick ? (
              <Link as="button" type="button" onClick={onSizeChartClick} className="text-xs">
                Size chart
              </Link>
            ) : null}
          </div>
          <SegmentedControl
            value={size}
            defaultValue={defaultSize}
            onValueChange={onSizeChange}
            aria-label="Size"
          >
            {sizes.map((option) => (
              <SegmentedControlItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Text className="text-sm font-medium">Quantity</Text>
        <NumberInput defaultValue={defaultQuantity} min={1} max={maxQuantity} onValueChange={onQuantityChange}>
          <div className="flex w-fit items-center gap-1 rounded-[var(--radius-field)] border border-[var(--input-border)] p-1">
            <NumberInputDecrement asChild>
              <IconButton aria-label="Decrease quantity" variant="text" color="neutral" size="sm">
                −
              </IconButton>
            </NumberInputDecrement>
            <NumberInputField aria-label="Quantity" className="w-10 border-none text-center" />
            <NumberInputIncrement asChild>
              <IconButton aria-label="Increase quantity" variant="text" color="neutral" size="sm">
                +
              </IconButton>
            </NumberInputIncrement>
          </div>
        </NumberInput>
      </div>

      {availability ? <Text className="text-sm text-[var(--color-success-text)]">{availability}</Text> : null}

      {primaryAction || secondaryAction || onCompare || onFavorite || onShare ? (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {primaryAction ? (
            <Button color="primary" className="flex-1" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button variant="ghost" color="primary" className="flex-1" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          ) : null}
          {onCompare ? (
            <IconButton aria-label="Compare" variant="ghost" color="neutral" onClick={onCompare}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v14M3 13l4 4 4-4M17 21V7M13 11l4-4 4 4" />
              </svg>
            </IconButton>
          ) : null}
          {onFavorite ? (
            <IconButton
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              variant="ghost"
              color={favorited ? 'danger' : 'neutral'}
              onClick={onFavorite}
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
          {onShare ? (
            <IconButton aria-label="Share" variant="ghost" color="neutral" onClick={onShare}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                <circle cx="18" cy="5" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <path d="M8.2 10.8 15.8 6.7M8.2 13.2l7.6 4.1" />
              </svg>
            </IconButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { ProductInfoPanel };
export type { ProductInfoPanelProps, ProductColorOption, ProductSizeOption, ProductInfoPanelAction };
