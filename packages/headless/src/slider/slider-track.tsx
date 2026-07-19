import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula-lab/primitives/compose-refs';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useSliderContext } from './slider-context';

import type { ScopedProps } from './slider-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const SLIDER_TRACK_NAME = 'SliderTrack';

type SliderTrackProps = PrimitivePropsWithRef<'div'>;

function valueFromPointer(
  event: { clientX: number; clientY: number },
  trackEl: HTMLElement,
  min: number,
  max: number,
  step: number,
  orientation: 'horizontal' | 'vertical',
) {
  const rect = trackEl.getBoundingClientRect();
  const rawPercent =
    orientation === 'horizontal'
      ? (event.clientX - rect.left) / rect.width
      : 1 - (event.clientY - rect.top) / rect.height;
  const percent = Math.min(1, Math.max(0, rawPercent));
  const raw = min + percent * (max - min);
  const stepped = Math.round(raw / step) * step;
  return Math.min(max, Math.max(min, stepped));
}

/**
 * The slider's visual track — also handles clicking directly on the track
 * (not on a thumb) by jumping whichever thumb is currently closest to the
 * clicked position, then continuing to drag that thumb for the rest of the
 * pointer gesture (uses `setPointerCapture` on the track itself so
 * `pointermove` keeps firing here even once the pointer leaves the track's
 * bounds, without needing document-level event listeners).
 *
 * @example
 * ```tsx
 * <SliderTrack>
 *   <SliderRange />
 *   <SliderThumb index={0} aria-label="Volume" />
 * </SliderTrack>
 * ```
 */
const SliderTrack = React.forwardRef<HTMLDivElement, ScopedProps<SliderTrackProps>>(
  (props, forwardedRef) => {
    const { __scopeSlider, onPointerDown, ...trackProps } = props;
    const context = useSliderContext(SLIDER_TRACK_NAME, __scopeSlider);
    const composedRef = useComposedRefs(forwardedRef, context.trackRef);
    const activeIndexRef = React.useRef<number | null>(null);

    return (
      <Primitive
        as="div"
        data-orientation={context.orientation}
        data-disabled={context.disabled ? '' : undefined}
        {...trackProps}
        ref={composedRef}
        onPointerDown={composeEventHandlers(onPointerDown, (event) => {
          if (context.disabled) return;
          const track = context.trackRef.current;
          if (!track) return;

          const clickedValue = valueFromPointer(
            event,
            track,
            context.min,
            context.max,
            context.step,
            context.orientation,
          );
          // Nearest thumb by current distance to the clicked value.
          let nearestIndex = 0;
          let nearestDistance = Infinity;
          context.values.forEach((thumbValue, index) => {
            const distance = Math.abs(thumbValue - clickedValue);
            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestIndex = index;
            }
          });

          activeIndexRef.current = nearestIndex;
          context.setValueAtIndex(nearestIndex, clickedValue);
          event.currentTarget.setPointerCapture(event.pointerId);
        })}
        onPointerMove={(event) => {
          if (activeIndexRef.current === null) return;
          const track = context.trackRef.current;
          if (!track) return;
          const next = valueFromPointer(
            event,
            track,
            context.min,
            context.max,
            context.step,
            context.orientation,
          );
          context.setValueAtIndex(activeIndexRef.current, next);
        }}
        onPointerUp={(event) => {
          activeIndexRef.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      />
    );
  },
);

SliderTrack.displayName = SLIDER_TRACK_NAME;

export { SliderTrack, valueFromPointer };
export type { SliderTrackProps };
