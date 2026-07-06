import { cn } from '@nebula/primitives/cn';
import { SliderTrack as StylelessSliderTrack } from '@nebula/styleless/slider';
import * as React from 'react';

import type { SliderTrackProps as StylelessSliderTrackProps } from '@nebula/styleless/slider';

type SliderTrackProps = StylelessSliderTrackProps;

/** `data-orientation` (set by the styleless source) switches between a full-width horizontal bar and a full-height vertical one. */
const SliderTrack = React.forwardRef<HTMLDivElement, SliderTrackProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessSliderTrack
      className={cn(
        'relative touch-none rounded-full bg-[var(--slider-track-bg)] data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

SliderTrack.displayName = 'SliderTrack';

export { SliderTrack };
export type { SliderTrackProps };
