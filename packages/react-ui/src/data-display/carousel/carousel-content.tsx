import { useMediaQuery, useSwipe } from '@nebula-lab/hooks';
import { cn } from '@nebula-lab/primitives/cn';
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useCarouselContext } from './carousel-context';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

/** Minimum horizontal wheel delta (px) before a trackpad/wheel gesture commits to a slide change. */
const WHEEL_THRESHOLD = 24;
/** How long (ms) to ignore further wheel deltas after committing one slide change, so a single trackpad swipe gesture (which fires many wheel events) doesn't skip several slides at once. */
const WHEEL_COOLDOWN_MS = 400;

type CarouselContentProps = PrimitivePropsWithRef<'div'>;

/**
 * The clipping viewport around the slide track — `CarouselItem`s are the
 * track's flex children, each `shrink-0 w-full` (or `h-full` when vertical),
 * and the whole track translates by `-index * 100%` via an inline `style`
 * (a CSS transform, not scroll position, so `CarouselPrevious`/`Next`'s
 * click-driven navigation doesn't fight a user's own scroll gesture — a
 * deliberately simpler model than a scroll-snap-based carousel, which would
 * need its own scroll-position-to-index sync logic).
 *
 * Also swipeable via `@nebula-lab/hooks`' `useSwipe`: dragging follows the
 * pointer in real time (live `delta` composed on top of the index-based
 * `translate`, transition disabled mid-drag so it doesn't lag), and a
 * release past the drag threshold advances/retreats the index the same way
 * `CarouselNext`/`CarouselPrevious` would — so a consumer can render just
 * `CarouselContent` with no nav buttons at all and still get a fully
 * navigable carousel, per the "swipe container, no left/right icons needed"
 * use case.
 *
 * Horizontal carousels also respond to trackpad/mouse-wheel horizontal
 * scroll (a two-finger trackpad swipe, shift+wheel, or a horizontal scroll
 * wheel) — see `WHEEL_THRESHOLD`/`WHEEL_COOLDOWN_MS` below.
 */
const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  (props, forwardedRef) => {
    const { className, children, onWheel, ...rest } = props;
    const context = useCarouselContext('CarouselContent');
    const vertical = context.orientation === 'vertical';

    const atStart = !context.loop && context.index === 0;
    const atEnd = !context.loop && context.index === context.count - 1;

    const { delta, isDragging, bind } = useSwipe({
      orientation: vertical ? 'vertical' : 'horizontal',
      disabled: context.count <= 1,
      onSwipeLeft: () => !atEnd && context.setIndex(context.index + 1),
      onSwipeRight: () => !atStart && context.setIndex(context.index - 1),
      onSwipeUp: () => !atEnd && context.setIndex(context.index + 1),
      onSwipeDown: () => !atStart && context.setIndex(context.index - 1),
    });

    // Clamp the live drag offset at the bounds so a non-looping carousel
    // resists (rather than freely drags past) its first/last slide.
    const clampedDelta =
      atEnd && delta < 0 ? Math.max(delta, -80) : atStart && delta > 0 ? Math.min(delta, 80) : delta;

    // Autoswipe — see `Carousel`'s `autoSwipeInterval` doc for the full
    // contract. Depending on `context.index` (not just mounting once) means
    // the timer tears down and restarts on *every* index change, whether it
    // came from this same timer or a real user interaction — so a manual
    // swipe always gets the full interval before autoswipe resumes, never a
    // half-finished countdown.
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    React.useEffect(() => {
      if (!context.autoSwipeInterval || prefersReducedMotion || isDragging || context.count <= 1) return;
      if (atEnd) return;
      const timer = window.setTimeout(() => {
        context.setIndex(context.index + 1);
      }, context.autoSwipeInterval);
      return () => window.clearTimeout(timer);
    }, [context, isDragging, prefersReducedMotion, atEnd]);

    // Trackpad/mouse-wheel navigation — horizontal only. A vertical
    // carousel skips this entirely: its natural wheel gesture (plain
    // deltaY) is indistinguishable from the page's own vertical scroll, so
    // hijacking it would trap scroll under the carousel, a well-documented
    // anti-pattern. Horizontal is safe because the *dominant* axis check
    // below only fires on a deltaX-heavy gesture (trackpad two-finger swipe,
    // shift+wheel) — plain vertical wheel scroll passes through untouched.
    const wheelCooldownRef = React.useRef(false);
    const handleWheel = React.useCallback(
      (event: React.WheelEvent<HTMLDivElement>) => {
        if (vertical || context.count <= 1) return;
        if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
        if (Math.abs(event.deltaX) < WHEEL_THRESHOLD) return;
        event.preventDefault();
        if (wheelCooldownRef.current) return;
        wheelCooldownRef.current = true;
        if (event.deltaX > 0) {
          if (!atEnd) context.setIndex(context.index + 1);
        } else if (!atStart) {
          context.setIndex(context.index - 1);
        }
        window.setTimeout(() => {
          wheelCooldownRef.current = false;
        }, WHEEL_COOLDOWN_MS);
      },
      [atEnd, atStart, context, vertical],
    );

    return (
      <Primitive
        as="div"
        className={cn('overflow-hidden', className)}
        onWheel={composeEventHandlers(onWheel, handleWheel)}
        {...rest}
        ref={forwardedRef}
      >
        <div
          {...bind}
          className={cn(
            'flex',
            // `width: auto` on a block box defaults to filling its
            // container, so the track is already exactly one slide's width
            // in horizontal mode with no extra class needed — but
            // `height: auto` has no such default (it shrinks to fit
            // content) on *either* axis. In vertical mode that breaks the
            // `translateY(-index * 100%)` transform below directly (it
            // resolves against this track's own height, so the wrong
            // height means every index past 0 jumps the wrong distance).
            // In horizontal mode it's more subtle: as long as nothing
            // upstream tries to *constrain* height (letting the tallest
            // slide dictate it, as every consumer did until now), an
            // `auto` track height is harmless. But the moment a consumer
            // sizes the root itself (e.g. via `aspect-ratio`, like
            // `PromoBannerCarousel`) expecting slide content to fill down
            // to *that* height, `h-full` is needed here too — otherwise
            // this track can't resolve a percentage height at all, and any
            // `h-full` a slide's own content uses falls back to `auto`,
            // silently ignoring the intended constraint and overflowing.
            // Always including it is safe either way: `h-full` against an
            // `auto`-height ancestor resolves to `auto` too per the CSS
            // spec, so unconstrained consumers see no behavior change.
            'h-full',
            vertical ? 'flex-col' : 'flex-row',
            isDragging ? 'cursor-grabbing' : 'cursor-grab',
            !isDragging && 'transition-transform duration-300 ease-in-out',
          )}
          style={{
            ...bind.style,
            transform: vertical
              ? `translateY(calc(-${context.index * 100}% + ${clampedDelta}px))`
              : `translateX(calc(-${context.index * 100}% + ${clampedDelta}px))`,
          }}
        >
          {children}
        </div>
      </Primitive>
    );
  },
);

CarouselContent.displayName = 'CarouselContent';

export { CarouselContent };
export type { CarouselContentProps };
