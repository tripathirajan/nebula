import { useControllableState, useSwipe } from '@nebula/hooks';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

interface SwipeableCardsProps<T> {
  /** The full card set, front to back. */
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  /** Controlled: the current (0-indexed, frontmost) card. */
  index?: number;
  /** Uncontrolled: the initial frontmost card. @default 0 */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Whether swiping past the last/first card wraps instead of resisting. @default false */
  loop?: boolean;
  /** Stable id for a card — used as its `key` instead of array index. @default (item, index) => index */
  getItemId?: (item: T, index: number) => string | number;
  className?: string;
  cardClassName?: string;
  'aria-label'?: string;
}

/**
 * A stacked deck of cards you swipe through — no `CarouselPrevious`/`Next`
 * buttons, unlike `Carousel`: the interaction model here (think a mobile
 * banking app's debit/credit card switcher) is "swipe the front card away,"
 * not "step through a linear track," so a fanned 3D stack with peeking
 * neighbors is the right visual, not a clipped single-slide viewport.
 *
 * Only the frontmost card (offset 0) is interactive/focusable — the peeking
 * cards behind it are `inert` (decorative depth cues only, same reasoning
 * `CarouselItem` documents for its inactive slides: a translucent sliver of
 * a card that's still in the tab order would be a real a11y trap). Built on
 * the same `@nebula/hooks`' `useSwipe` primitive `Carousel` uses, just with
 * a per-card fan transform instead of one shared track transform.
 *
 * Sizing is the caller's responsibility (e.g. a fixed-aspect-ratio
 * `className`) since every card renders `absolute inset-0` to stack in
 * place — see the story for a typical bank-card aspect ratio.
 *
 * @example
 * ```tsx
 * <SwipeableCards
 *   items={cards}
 *   getItemId={(card) => card.id}
 *   renderCard={(card) => <BankCard card={card} />}
 *   className="aspect-[1.6/1] w-80"
 * />
 * ```
 */
function SwipeableCards<T>(props: SwipeableCardsProps<T>) {
  const {
    items,
    renderCard,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    loop = false,
    getItemId = (_item, index) => index,
    className,
    cardClassName,
    'aria-label': ariaLabel,
  } = props;

  const [index, setIndexRaw] = useControllableState<number>({
    prop: indexProp,
    defaultProp: defaultIndex,
    onChange: onIndexChange,
  });
  const current = index ?? defaultIndex;
  const count = items.length;

  const setIndex = React.useCallback(
    (next: number) => {
      if (count <= 0) return;
      setIndexRaw(loop ? ((next % count) + count) % count : Math.max(0, Math.min(count - 1, next)));
    },
    [count, loop, setIndexRaw],
  );

  const atStart = !loop && current === 0;
  const atEnd = !loop && current === count - 1;

  const { delta, isDragging, bind } = useSwipe({
    orientation: 'horizontal',
    disabled: count <= 1,
    threshold: 80,
    onSwipeLeft: () => !atEnd && setIndex(current + 1),
    onSwipeRight: () => !atStart && setIndex(current - 1),
  });

  return (
    <div
      role="region"
      aria-roledescription="card stack"
      aria-label={ariaLabel ?? 'Cards'}
      className={cn('relative', className)}
    >
      {items.map((item, itemIndex) => {
        let offset = itemIndex - current;
        if (loop && count > 0) {
          offset = ((offset % count) + count) % count;
          if (offset > count / 2) offset -= count;
        }
        const isActive = offset === 0;
        const visualOffset = Math.max(-2, Math.min(2, offset));
        const drag = isActive ? delta : 0;
        const rotate = isActive ? drag / 24 : 0;
        const scale = 1 - Math.abs(visualOffset) * 0.06;
        const translateX = drag + visualOffset * 14;
        const translateY = Math.abs(visualOffset) * 10;
        const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(visualOffset) * 0.1;

        return (
          <div
            key={getItemId(item, itemIndex)}
            {...(isActive ? bind : undefined)}
            role="group"
            aria-roledescription="card"
            aria-label={`${itemIndex + 1} of ${count}`}
            aria-hidden={!isActive}
            inert={!isActive}
            data-state={isActive ? 'active' : 'inactive'}
            className={cn(
              'absolute inset-0',
              isActive ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'pointer-events-none',
              !isDragging && 'transition-[transform,opacity] duration-300 ease-out',
              cardClassName,
            )}
            style={{
              ...(isActive ? bind.style : undefined),
              zIndex: 100 - Math.abs(visualOffset),
              opacity,
              transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
            }}
          >
            {renderCard(item, itemIndex)}
          </div>
        );
      })}
    </div>
  );
}

export { SwipeableCards };
export type { SwipeableCardsProps };
