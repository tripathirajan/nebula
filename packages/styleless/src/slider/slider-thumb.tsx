import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Primitive } from '@nebula/primitives/primitive';
import { VisuallyHidden } from '@nebula/primitives/visually-hidden';
import * as React from 'react';

import { useSliderContext } from './slider-context';
import { valueFromPointer } from './slider-track';

import type { ScopedProps } from './slider-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const SLIDER_THUMB_NAME = 'SliderThumb';

interface SliderThumbProps extends PrimitivePropsWithRef<'div'> {
  /** Which entry of `Slider`'s `values` array this thumb represents. `0` for a plain slider; `0`/`1` for a range slider's low/high thumb. */
  index: number;
}

/**
 * `role="slider"` — draggable via `setPointerCapture` on itself (so
 * `pointermove` keeps firing here even once the pointer leaves the thumb's
 * small hit area, without document-level listeners), and fully
 * keyboard-operable per the WAI-ARIA Slider pattern: Arrow Left/Right (or
 * Up/Down, whichever matches `orientation`) by `step`, Home/End jump to
 * `min`/`max`, Page Up/Page Down by 10 steps. A visually-hidden native
 * `<input type="range">` mirrors the value for `<form>` submission when
 * `Slider`'s `name` is given, same hidden-input technique `Checkbox`/
 * `RadioGroup` use.
 *
 * Always pass an `aria-label` (or `aria-labelledby`) — a lone thumb rarely
 * has adjacent visible text naming it.
 *
 * @example
 * ```tsx
 * <SliderThumb index={0} aria-label="Volume" />
 * ```
 */
const SliderThumb = React.forwardRef<HTMLDivElement, ScopedProps<SliderThumbProps>>(
  (props, forwardedRef) => {
    const { __scopeSlider, index, onPointerDown, onPointerMove, onKeyDown, style, ...thumbProps } =
      props;
    const context = useSliderContext(SLIDER_THUMB_NAME, __scopeSlider);
    const value = context.values[index] ?? context.min;
    const span = context.max - context.min || 1;
    const percent = ((value - context.min) / span) * 100;
    const bigStep = context.step * 10;

    const setValue = (next: number) => {
      const clamped = Math.min(context.max, Math.max(context.min, next));
      context.setValueAtIndex(index, clamped);
    };

    return (
      <>
        <Primitive
          as="div"
          role="slider"
          tabIndex={context.disabled ? -1 : 0}
          aria-valuemin={context.min}
          aria-valuemax={context.max}
          aria-valuenow={value}
          aria-orientation={context.orientation}
          aria-disabled={context.disabled || undefined}
          data-orientation={context.orientation}
          data-disabled={context.disabled ? '' : undefined}
          style={{
            ...style,
            ['--nebula-slider-thumb-percent' as string]: `${percent}%`,
          }}
          {...thumbProps}
          ref={forwardedRef}
          onPointerDown={composeEventHandlers(onPointerDown, (event) => {
            if (context.disabled) return;
            event.currentTarget.setPointerCapture(event.pointerId);
          })}
          onPointerMove={composeEventHandlers(onPointerMove, (event) => {
            if (context.disabled || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
            const track = context.trackRef.current;
            if (!track) return;
            setValue(
              valueFromPointer(event, track, context.min, context.max, context.step, context.orientation),
            );
          })}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (context.disabled) return;
            const isHorizontal = context.orientation === 'horizontal';
            switch (event.key) {
              case 'ArrowRight':
                if (isHorizontal) {
                  event.preventDefault();
                  setValue(value + context.step);
                }
                break;
              case 'ArrowUp':
                event.preventDefault();
                setValue(value + context.step);
                break;
              case 'ArrowLeft':
                if (isHorizontal) {
                  event.preventDefault();
                  setValue(value - context.step);
                }
                break;
              case 'ArrowDown':
                event.preventDefault();
                setValue(value - context.step);
                break;
              case 'PageUp':
                event.preventDefault();
                setValue(value + bigStep);
                break;
              case 'PageDown':
                event.preventDefault();
                setValue(value - bigStep);
                break;
              case 'Home':
                event.preventDefault();
                setValue(context.min);
                break;
              case 'End':
                event.preventDefault();
                setValue(context.max);
                break;
              default:
                break;
            }
          })}
        />
        {context.name ? (
          <VisuallyHidden as="span">
            <input
              type="range"
              tabIndex={-1}
              aria-hidden="true"
              name={context.values.length > 1 ? `${context.name}[${index}]` : context.name}
              min={context.min}
              max={context.max}
              step={context.step}
              value={value}
              disabled={context.disabled}
              onChange={() => {}}
            />
          </VisuallyHidden>
        ) : null}
      </>
    );
  },
);

SliderThumb.displayName = SLIDER_THUMB_NAME;

export { SliderThumb };
export type { SliderThumbProps };
