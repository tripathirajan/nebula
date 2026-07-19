import { useCallback, useMemo, useRef, useState } from 'react';

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';

type SwipeOrientation = 'horizontal' | 'vertical';

interface UseSwipeOptions {
  /** Axis the drag delta is measured along. @default 'horizontal' */
  orientation?: SwipeOrientation;
  /** Minimum drag distance (px) on release for a swipe to commit rather than spring back. @default 50 */
  threshold?: number;
  /** Fires on pointer down, before any movement. */
  onSwipeStart?: () => void;
  /** Fires on every pointer move while dragging, with the live delta (px) along `orientation`'s axis — positive is right/down, negative is left/up. */
  onSwipeMove?: (delta: number) => void;
  /** Fires on release with the final delta, before the directional callbacks below resolve. */
  onSwipeEnd?: (delta: number) => void;
  /** Fires on release when the final delta exceeds `threshold` to the left (horizontal only). */
  onSwipeLeft?: () => void;
  /** Fires on release when the final delta exceeds `threshold` to the right (horizontal only). */
  onSwipeRight?: () => void;
  /** Fires on release when the final delta exceeds `threshold` upward (vertical only). */
  onSwipeUp?: () => void;
  /** Fires on release when the final delta exceeds `threshold` downward (vertical only). */
  onSwipeDown?: () => void;
  /** Disables all pointer handling — the returned handlers become no-ops. @default false */
  disabled?: boolean;
}

interface UseSwipeResult {
  /** Live drag offset (px) along the tracked axis; 0 when idle or after a completed swipe. */
  delta: number;
  isDragging: boolean;
  /** Spread directly onto the swipeable element: `<div {...bind}>`. Includes a `touchAction` style that constrains native browser scroll/pull gestures to the *other* axis, so a horizontal swipe doesn't fight vertical page scroll and vice versa. */
  bind: {
    onPointerDown: (event: ReactPointerEvent) => void;
    onPointerMove: (event: ReactPointerEvent) => void;
    onPointerUp: (event: ReactPointerEvent) => void;
    onPointerCancel: (event: ReactPointerEvent) => void;
    style: CSSProperties;
  };
}

/**
 * Pointer-based drag/swipe gesture tracking — reports a live delta while
 * dragging and resolves to directional callbacks on release, with no opinion
 * about what a "swipe" should *do* (advance a slide index, dismiss a card,
 * etc). Built on the Pointer Events API (covers mouse, touch, and pen in one
 * listener set) with `setPointerCapture` so a drag that leaves the element's
 * bounds is still tracked to release, matching native drag/scroll behavior.
 *
 * Shared by `Carousel` (linear track swipe) and `SwipeableCards` (stacked
 * card swipe) — both need the same delta-tracking primitive, just different
 * visual responses to it.
 *
 * @example
 * ```tsx
 * function SwipeToDismiss({ onDismiss }: { onDismiss: () => void }) {
 *   const { delta, bind } = useSwipe({ onSwipeLeft: onDismiss, onSwipeRight: onDismiss });
 *   return <div {...bind} style={{ ...bind.style, transform: `translateX(${delta}px)` }} />;
 * }
 * ```
 */
function useSwipe(options: UseSwipeOptions = {}): UseSwipeResult {
  const {
    orientation = 'horizontal',
    threshold = 50,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    disabled = false,
  } = options;

  const [delta, setDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const axisValue = useCallback(
    (event: ReactPointerEvent) => (orientation === 'horizontal' ? event.clientX : event.clientY),
    [orientation],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (disabled) return;
      startRef.current = axisValue(event);
      pointerIdRef.current = event.pointerId;
      // Not every environment implements pointer capture (jsdom, some older
      // WebViews) — feature-detect rather than assume, since without it the
      // gesture still works for a drag that stays within the element, just
      // without the browser continuing delivery once the pointer leaves it.
      if (typeof event.currentTarget.setPointerCapture === 'function') {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      setIsDragging(true);
      setDelta(0);
      onSwipeStart?.();
    },
    [axisValue, disabled, onSwipeStart],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (disabled || pointerIdRef.current !== event.pointerId) return;
      const next = axisValue(event) - startRef.current;
      setDelta(next);
      onSwipeMove?.(next);
    },
    [axisValue, disabled, onSwipeMove],
  );

  const resolve = useCallback(
    (final: number) => {
      pointerIdRef.current = null;
      setIsDragging(false);
      setDelta(0);
      onSwipeEnd?.(final);
      if (Math.abs(final) < threshold) return;
      if (orientation === 'horizontal') {
        if (final < 0) onSwipeLeft?.();
        else onSwipeRight?.();
      } else {
        if (final < 0) onSwipeUp?.();
        else onSwipeDown?.();
      }
    },
    [onSwipeDown, onSwipeEnd, onSwipeLeft, onSwipeRight, onSwipeUp, orientation, threshold],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent) => {
      if (disabled || pointerIdRef.current !== event.pointerId) return;
      resolve(axisValue(event) - startRef.current);
    },
    [axisValue, disabled, resolve],
  );

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent) => {
      if (disabled || pointerIdRef.current !== event.pointerId) return;
      resolve(0);
    },
    [disabled, resolve],
  );

  const bind = useMemo(
    () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      style: { touchAction: orientation === 'horizontal' ? 'pan-y' : 'pan-x' } as CSSProperties,
    }),
    [onPointerCancel, onPointerDown, onPointerMove, onPointerUp, orientation],
  );

  return { delta, isDragging, bind };
}

export { useSwipe };
export type { SwipeOrientation, UseSwipeOptions, UseSwipeResult };
