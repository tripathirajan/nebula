import { cn } from '@nebula/primitives/cn';
import { Carousel, CarouselContent, CarouselIndicators, CarouselItem } from '@nebula/react-ui/carousel';

import { PromoBanner } from './promo-banner';

import type { PromoBannerProps } from './promo-banner';

interface PromoBannerCarouselProps {
  banners: PromoBannerProps[];
  /** Controlled: the current (0-indexed) banner. */
  index?: number;
  /** Uncontrolled: the initial banner. @default 0 */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Whether swiping/scrolling past the last banner wraps to the first. @default true — an ad rotation reads more naturally as an endless loop than a slider that dead-ends. */
  loop?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * One promo banner on screen at a time, navigated by swipe (touch/pointer
 * drag) or trackpad/wheel scroll — no `CarouselPrevious`/`CarouselNext`
 * buttons, matching the reference "story-style" ad slider this was built
 * from: just the card, a dot trail, and a gesture. Built entirely from
 * `Carousel`'s existing parts (`Carousel`/`CarouselContent`/`CarouselItem`/
 * `CarouselIndicators`), so it inherits that component's swipe/wheel/a11y
 * behavior for free rather than re-implementing any of it here.
 *
 * The aspect ratio is owned here (not per-`PromoBanner`) and steps wider
 * at each breakpoint, so every slide shares one consistent size — swiping
 * never causes a height jump — while still adapting to the viewport rather
 * than staying fixed-pixel.
 *
 * @example
 * ```tsx
 * <PromoBannerCarousel
 *   aria-label="Promotions"
 *   banners={[
 *     { headline: 'Premium plans, up to 50% off', color: 'info', media: <img src="/a.png" alt="" /> },
 *     { headline: 'Free shipping this week', color: 'success', media: <img src="/b.png" alt="" /> },
 *   ]}
 * />
 * ```
 */
function PromoBannerCarousel(props: PromoBannerCarouselProps) {
  const { banners, index, defaultIndex, onIndexChange, loop = true, className, 'aria-label': ariaLabel } = props;

  return (
    <Carousel
      count={banners.length}
      index={index}
      defaultIndex={defaultIndex}
      onIndexChange={onIndexChange}
      loop={loop}
      aria-label={ariaLabel ?? 'Promotions'}
      className={cn('aspect-[1.8/1] w-full sm:aspect-[2.2/1] md:aspect-[2.8/1]', className)}
    >
      <CarouselContent className="h-full">
        {banners.map((banner, bannerIndex) => (
          <CarouselItem key={bannerIndex} index={bannerIndex} className="h-full">
            <PromoBanner {...banner} className={cn('h-full w-full', banner.className)} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselIndicators />
    </Carousel>
  );
}

export { PromoBannerCarousel };
export type { PromoBannerCarouselProps };
