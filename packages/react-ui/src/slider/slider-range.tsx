import { SliderRange as HeadlessSliderRange } from '@nebula-lab/headless/slider';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { SliderRangeProps as HeadlessSliderRangeProps } from '@nebula-lab/headless/slider';

type SliderRangeProps = HeadlessSliderRangeProps;

/** Positioned off the `--nebula-slider-range-start`/`-end` inline custom properties the headless source sets — spans between the low/high thumb (or from the track's start to the single thumb, for a plain slider). */
const SliderRange = React.forwardRef<HTMLDivElement, SliderRangeProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessSliderRange
      className={cn(
        'absolute rounded-full bg-[var(--slider-range-bg)] data-[orientation=horizontal]:top-0 data-[orientation=horizontal]:h-full data-[orientation=horizontal]:left-[var(--nebula-slider-range-start)] data-[orientation=horizontal]:right-[calc(100%-var(--nebula-slider-range-end))] data-[orientation=vertical]:left-0 data-[orientation=vertical]:w-full data-[orientation=vertical]:bottom-[var(--nebula-slider-range-start)] data-[orientation=vertical]:top-[calc(100%-var(--nebula-slider-range-end))]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

SliderRange.displayName = 'SliderRange';

export { SliderRange };
export type { SliderRangeProps };
