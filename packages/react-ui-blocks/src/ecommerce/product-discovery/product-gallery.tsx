import { cn } from '@nebula-lab/primitives/cn';
import { Image } from '@nebula-lab/primitives/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@nebula-lab/react-ui/carousel';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

interface ProductGalleryImage {
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ProductGalleryImage[];
  className?: string;
}

/**
 * Product Detail's image gallery (§2.16/§3.7 Product Detail → *Gallery*) —
 * a main `Carousel` view + slide counter + prev/next, plus a thumbnail
 * strip below for direct navigation. Built on `react-ui`'s existing
 * `Carousel` rather than a bespoke slider: a product gallery's needs
 * (indexed slides, prev/next, "jump to slide N") are exactly what
 * `Carousel` already models — the thumbnail strip is the only genuinely
 * new piece, so it's the only thing this component adds.
 *
 * `index` is owned locally (uncontrolled) rather than exposed as a
 * controlled prop — same precedent `ChatWindow`'s composer draft and
 * `DataTableBlock`'s page-size `<select>` set: nothing outside a product
 * page would ever need to observe or drive which gallery image is showing.
 *
 * @example
 * ```tsx
 * <ProductGallery
 *   images={[
 *     { src: '/products/sneaker-1.jpg', alt: 'White low-top sneaker, side view' },
 *     { src: '/products/sneaker-2.jpg', alt: 'White low-top sneaker, top view' },
 *   ]}
 * />
 * ```
 */
function ProductGallery(props: ProductGalleryProps) {
  const { images, className } = props;
  const [index, setIndex] = React.useState(0);
  const hasMultiple = images.length > 1;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Carousel
        count={images.length}
        index={index}
        onIndexChange={setIndex}
        loop
        aria-label="Product images"
      >
        <CarouselContent className="rounded-[var(--radius-box)]">
          {images.map((image, i) => (
            <CarouselItem key={image.src} index={i}>
              <Image src={image.src} alt={image.alt} className="aspect-square w-full object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasMultiple ? (
          <>
            <CarouselPrevious />
            <CarouselNext />
            <Text
              className="absolute bottom-2 right-2 z-[var(--z-local)] rounded-full bg-[var(--color-base-100)]/80 px-2 py-0.5 text-xs font-medium"
              aria-hidden="true"
            >
              {index + 1} / {images.length}
            </Text>
          </>
        ) : null}
      </Carousel>
      {hasMultiple ? (
        <div role="tablist" aria-label="Product image thumbnails" className="flex gap-2 overflow-x-auto">
          {images.map((image, i) => {
            const active = i === index;
            return (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`View image ${i + 1} of ${images.length}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-selector)] border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-base-content)] focus-visible:ring-offset-1',
                  active ? 'border-[var(--color-primary)]' : 'border-transparent',
                )}
              >
                <Image src={image.src} alt="" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export { ProductGallery };
export type { ProductGalleryProps, ProductGalleryImage };
