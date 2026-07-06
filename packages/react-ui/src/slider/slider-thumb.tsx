import { cn } from '@nebula/primitives/cn';
import { SliderThumb as StylelessSliderThumb } from '@nebula/styleless/slider';
import * as React from 'react';

import type { SliderThumbProps as StylelessSliderThumbProps } from '@nebula/styleless/slider';

type SliderThumbProps = StylelessSliderThumbProps;

/** Positioned off the `--nebula-slider-thumb-percent` inline custom property the styleless source sets, centered on the track's cross-axis. */
const SliderThumb = React.forwardRef<HTMLDivElement, SliderThumbProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessSliderThumb
      className={cn(
        'absolute block h-4 w-4 rounded-full border-2 border-[var(--slider-thumb-border)] bg-[var(--slider-thumb-bg)] shadow outline-none focus-visible:ring-2 focus-visible:ring-[var(--slider-thumb-border)] focus-visible:ring-offset-1 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:left-[var(--nebula-slider-thumb-percent)] data-[orientation=horizontal]:-translate-x-1/2 data-[orientation=horizontal]:-translate-y-1/2 data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:bottom-[var(--nebula-slider-thumb-percent)] data-[orientation=vertical]:-translate-x-1/2 data-[orientation=vertical]:translate-y-1/2',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

SliderThumb.displayName = 'SliderThumb';

export { SliderThumb };
export type { SliderThumbProps };
