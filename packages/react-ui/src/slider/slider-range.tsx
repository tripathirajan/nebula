import { cn } from '@nebula/primitives/cn';
import { SliderRange as StylelessSliderRange } from '@nebula/styleless/slider';
import * as React from 'react';

import type { SliderRangeProps as StylelessSliderRangeProps } from '@nebula/styleless/slider';

type SliderRangeProps = StylelessSliderRangeProps;

/** Positioned off the `--nebula-slider-range-start`/`-end` inline custom properties the styleless source sets — spans between the low/high thumb (or from the track's start to the single thumb, for a plain slider). */
const SliderRange = React.forwardRef<HTMLDivElement, SliderRangeProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessSliderRange
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
