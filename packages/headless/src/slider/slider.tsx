import { useControllableState } from '@nebula-lab/hooks';
import * as React from 'react';

import { SliderProvider } from './slider-context';

import type { ScopedProps, SliderOrientation } from './slider-context';

interface SliderProps {
  /** One value per thumb. A plain slider has one value; a range slider has two. */
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  /** @default 1 */
  step?: number;
  disabled?: boolean;
  /** @default 'horizontal' */
  orientation?: SliderOrientation;
  /** Forwarded to a visually-hidden native input per thumb for `<form>` submission (see `SliderThumb`). */
  name?: string;
  children?: React.ReactNode;
}

/**
 * Root of the Slider compound component — the WAI-ARIA
 * [Slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) (and,
 * with two thumbs, its
 * [Slider (Multi-Thumb)](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/)
 * variant). There's deliberately no separate `RangeSlider` component: `value`
 * is always an array (one entry per thumb), so a two-value array plus two
 * `SliderThumb`s already *is* a range slider — same "the general case
 * subsumes the specific one" reasoning that kept `ToggleGroup` from needing
 * a separate two-state variant.
 *
 * @example
 * ```tsx
 * // Single thumb:
 * <Slider defaultValue={[50]} min={0} max={100}>
 *   <SliderTrack>
 *     <SliderRange />
 *     <SliderThumb index={0} aria-label="Volume" />
 *   </SliderTrack>
 * </Slider>
 *
 * // Range (two thumbs):
 * <Slider defaultValue={[20, 80]} min={0} max={100}>
 *   <SliderTrack>
 *     <SliderRange />
 *     <SliderThumb index={0} aria-label="Minimum price" />
 *     <SliderThumb index={1} aria-label="Maximum price" />
 *   </SliderTrack>
 * </Slider>
 * ```
 */
function Slider(props: ScopedProps<SliderProps>) {
  const {
    __scopeSlider,
    value: valueProp,
    defaultValue = [0],
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    orientation = 'horizontal',
    name,
    children,
  } = props;

  const [values, setValues] = useControllableState<number[]>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const trackRef = React.useRef<HTMLDivElement>(null);

  return (
    <SliderProvider
      scope={__scopeSlider}
      values={values ?? defaultValue}
      setValueAtIndex={(index, next) => {
        const clamped = Math.min(max, Math.max(min, next));
        setValues((current) => {
          const nextValues = [...(current ?? defaultValue)];
          nextValues[index] = clamped;
          return nextValues;
        });
      }}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      orientation={orientation}
      name={name}
      trackRef={trackRef}
    >
      {children}
    </SliderProvider>
  );
}

export { Slider };
export type { SliderProps };
