// The root renders no DOM of its own (just context + state) — nothing to
// style, re-exported as-is from `@nebula/headless`. There's no separate
// `RangeSlider` here either — `value` is always an array, so a two-value
// array plus two `SliderThumb`s already is a range slider, same reasoning
// the headless source documents.
export { Slider } from '@nebula/headless/slider';
export type { SliderProps } from '@nebula/headless/slider';
