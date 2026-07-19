import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useSliderContext } from './slider-context';

import type { ScopedProps } from './slider-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const SLIDER_RANGE_NAME = 'SliderRange';

type SliderRangeProps = PrimitivePropsWithRef<'div'>;

/**
 * The filled portion of the track — spans from the track's start to the
 * single thumb's value (a plain slider), or between the two thumbs' values
 * (a range slider), computed generically off `Math.min`/`Math.max` of
 * `values` either way. Purely presentational (`react-ui` positions it via
 * `data-orientation` + the inline `--nebula-slider-range-start`/`-end`
 * custom properties this sets, rather than this layer hardcoding any CSS).
 *
 * @example
 * ```tsx
 * <SliderRange />
 * ```
 */
const SliderRange = React.forwardRef<HTMLDivElement, ScopedProps<SliderRangeProps>>(
  (props, forwardedRef) => {
    const { __scopeSlider, style, ...rangeProps } = props;
    const context = useSliderContext(SLIDER_RANGE_NAME, __scopeSlider);
    const span = context.max - context.min || 1;
    const startPercent = ((Math.min(...context.values) - context.min) / span) * 100;
    const endPercent = ((Math.max(...context.values) - context.min) / span) * 100;

    return (
      <Primitive
        as="div"
        data-orientation={context.orientation}
        style={{
          ...style,
          ['--nebula-slider-range-start' as string]: `${startPercent}%`,
          ['--nebula-slider-range-end' as string]: `${endPercent}%`,
        }}
        {...rangeProps}
        ref={forwardedRef}
      />
    );
  },
);

SliderRange.displayName = SLIDER_RANGE_NAME;

export { SliderRange };
export type { SliderRangeProps };
