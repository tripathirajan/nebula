import * as React from 'react';

import { useComposedRefs } from '../compose-refs/compose-refs';
import { Primitive } from '../primitive/primitive';

import { usePopperContext } from './popper-context';

import type { ScopedProps } from './popper-context';
import type { PrimitivePropsWithRef } from '../primitive/primitive';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

interface ComputePositionOptions {
  side: Side;
  sideOffset: number;
  align: Align;
  alignOffset: number;
  avoidCollisions: boolean;
  collisionPadding: number;
  viewport: { width: number; height: number };
}

interface ComputedPosition {
  side: Side;
  top: number;
  left: number;
}

/**
 * Pure positioning math, exported for unit testing independent of any DOM —
 * given the anchor's and content's measured rects (`getBoundingClientRect`),
 * returns fixed-position `top`/`left` coordinates. Two passes: first picks
 * the primary-axis side (flipping to the opposite side, when
 * `avoidCollisions`, if the preferred one doesn't fit), then clamps the
 * cross-axis position within the viewport (a "shift" collision strategy —
 * simpler than resizing content to fit, matching what most popovers/tooltips
 * actually need).
 */
function computePosition(
  anchorRect: Rect,
  contentRect: Rect,
  options: ComputePositionOptions,
): ComputedPosition {
  const { sideOffset, align, alignOffset, avoidCollisions, collisionPadding, viewport } = options;
  let { side } = options;

  const fitsOnSide = (candidate: Side): boolean => {
    switch (candidate) {
      case 'top':
        return anchorRect.top - contentRect.height - sideOffset >= collisionPadding;
      case 'bottom':
        return (
          anchorRect.bottom + contentRect.height + sideOffset <= viewport.height - collisionPadding
        );
      case 'left':
        return anchorRect.left - contentRect.width - sideOffset >= collisionPadding;
      case 'right':
        return (
          anchorRect.right + contentRect.width + sideOffset <= viewport.width - collisionPadding
        );
    }
  };

  if (avoidCollisions && !fitsOnSide(side)) {
    const opposite: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
    if (fitsOnSide(opposite[side])) side = opposite[side];
  }

  let top: number;
  let left: number;

  if (side === 'top' || side === 'bottom') {
    top = side === 'top' ? anchorRect.top - contentRect.height - sideOffset : anchorRect.bottom + sideOffset;
    const start = anchorRect.left;
    const center = anchorRect.left + (anchorRect.width - contentRect.width) / 2;
    const end = anchorRect.right - contentRect.width;
    left = (align === 'start' ? start : align === 'end' ? end : center) + alignOffset;
  } else {
    left = side === 'left' ? anchorRect.left - contentRect.width - sideOffset : anchorRect.right + sideOffset;
    const start = anchorRect.top;
    const center = anchorRect.top + (anchorRect.height - contentRect.height) / 2;
    const end = anchorRect.bottom - contentRect.height;
    top = (align === 'start' ? start : align === 'end' ? end : center) + alignOffset;
  }

  if (avoidCollisions) {
    if (side === 'top' || side === 'bottom') {
      const max = viewport.width - contentRect.width - collisionPadding;
      left = Math.min(Math.max(left, collisionPadding), Math.max(max, collisionPadding));
    } else {
      const max = viewport.height - contentRect.height - collisionPadding;
      top = Math.min(Math.max(top, collisionPadding), Math.max(max, collisionPadding));
    }
  }

  return { side, top, left };
}

interface PopperContentProps extends PrimitivePropsWithRef<'div'> {
  /** Which side of the anchor to render on. @default 'bottom' */
  side?: Side;
  /** Gap between the anchor and content along the `side` axis. @default 0 */
  sideOffset?: number;
  /** Alignment along the cross axis relative to the anchor. @default 'center' */
  align?: Align;
  /** Additional offset along the cross axis. @default 0 */
  alignOffset?: number;
  /** Flip to the opposite `side` if the preferred one doesn't fit, and shift along the cross axis to stay within the viewport. @default true */
  avoidCollisions?: boolean;
  /** Minimum distance to keep from the viewport edge when avoiding collisions. @default 8 */
  collisionPadding?: number;
}

/**
 * Positions itself against `PopperAnchor`'s element using `position: fixed`
 * — recomputed on window resize/scroll and, where available, via
 * `ResizeObserver` on both the anchor and this content (so e.g. a
 * dynamically-resizing anchor or content doesn't leave the popover
 * misaligned). Falls back to resize/scroll-only reactivity in environments
 * without `ResizeObserver` (e.g. jsdom in tests) rather than throwing.
 * Sets `data-side`/`data-align` to whatever was *actually* resolved (post
 * flip), not just the requested props, so consumers can style entry
 * animations per final placement.
 *
 * @example
 * ```tsx
 * <PopperContent side="bottom" align="start" sideOffset={4}>
 *   {content}
 * </PopperContent>
 * ```
 */
const PopperContent = React.forwardRef<HTMLDivElement, ScopedProps<PopperContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopePopper,
      side: sideProp = 'bottom',
      sideOffset = 0,
      align: alignProp = 'center',
      alignOffset = 0,
      avoidCollisions = true,
      collisionPadding = 8,
      style,
      ...contentProps
    } = props;
    const context = usePopperContext('PopperContent', __scopePopper);

    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, contentRef);
    const [position, setPosition] = React.useState<ComputedPosition | null>(null);

    const measure = React.useCallback(() => {
      const anchor = context.anchor;
      const content = contentRef.current;
      if (!anchor || !content) return;

      setPosition(
        computePosition(anchor.getBoundingClientRect(), content.getBoundingClientRect(), {
          side: sideProp,
          sideOffset,
          align: alignProp,
          alignOffset,
          avoidCollisions,
          collisionPadding,
          viewport: { width: window.innerWidth, height: window.innerHeight },
        }),
      );
    }, [context.anchor, sideProp, sideOffset, alignProp, alignOffset, avoidCollisions, collisionPadding]);

    React.useLayoutEffect(measure, [measure]);

    React.useEffect(() => {
      window.addEventListener('resize', measure);
      window.addEventListener('scroll', measure, true);
      return () => {
        window.removeEventListener('resize', measure);
        window.removeEventListener('scroll', measure, true);
      };
    }, [measure]);

    React.useEffect(() => {
      if (typeof ResizeObserver === 'undefined') return undefined;
      const content = contentRef.current;
      const anchor = context.anchor;
      const observer = new ResizeObserver(measure);
      if (content) observer.observe(content);
      if (anchor) observer.observe(anchor);
      return () => observer.disconnect();
    }, [context.anchor, measure]);

    return (
      <Primitive
        as="div"
        data-side={position?.side ?? sideProp}
        data-align={alignProp}
        {...contentProps}
        ref={composedRef}
        style={{
          position: 'fixed',
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          // Hide until the first real measurement lands, rather than
          // flashing at (0, 0) for a frame.
          visibility: position ? 'visible' : 'hidden',
          ...style,
        }}
      />
    );
  },
);

PopperContent.displayName = 'PopperContent';

export { PopperContent, computePosition };
export type { PopperContentProps, Side, Align };
