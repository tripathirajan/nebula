import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';
import type { RefObject } from 'react';

type SliderOrientation = 'horizontal' | 'vertical';

interface SliderContextValue {
  /** One value per thumb — a single-thumb slider has `values.length === 1`; a range slider (two thumbs) has `values.length === 2`. There's no separate "RangeSlider" component: it's this same `Slider` rendered with two `SliderThumb`s and a two-element `value`/`defaultValue` array. */
  values: number[];
  setValueAtIndex: (index: number, value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  orientation: SliderOrientation;
  name: string | undefined;
  /** The mounted `SliderTrack` root — read by both `SliderTrack` (to jump the nearest thumb on a direct track click) and `SliderThumb` (to compute a value from pointer position while dragging) so the pointer-to-value math only lives in one place. */
  trackRef: RefObject<HTMLDivElement | null>;
}

const SLIDER_NAME = 'Slider';

/**
 * Scoped context factory for Slider — mirrors every other compound
 * component's use of `createContextScope`.
 */
const [createSliderContext, createSliderScope] = createContextScope(SLIDER_NAME);
const [SliderProvider, useSliderContext] = createSliderContext<SliderContextValue>(SLIDER_NAME);

/** Every consumer prop object accepts an optional internal `__scopeSlider` prop threaded through by `createSliderScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeSlider?: Scope<SliderContextValue> };

export { SLIDER_NAME, SliderProvider, useSliderContext, createSliderScope };
export type { SliderContextValue, ScopedProps, SliderOrientation };
