
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { ProgressProvider } from './progress-context';

import type { ProgressState, ScopedProps } from './progress-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const DEFAULT_MAX = 100;

interface ProgressProps extends PrimitivePropsWithRef<'div'> {
  /**
   * Current progress, `0`–`max`. Pass `null` for an indeterminate progress
   * bar — a busy/loading state whose completion can't be measured (e.g. an
   * upload before the total size is known).
   * @default null
   */
  value?: number | null;
  /** @default 100 */
  max?: number;
  /**
   * Formats `aria-valuetext` for screen readers, e.g.
   * `(value, max) => \`${value} of ${max} steps\``. Omit to fall back to the
   * browser's default percentage announcement of `aria-valuenow`/`aria-valuemax`.
   */
  getValueLabel?: (value: number, max: number) => string;
}

function getInvalidMaxError(max: number): string {
  return `Progress's \`max\` prop must be a positive number; received ${max}. Falling back to ${DEFAULT_MAX}.`;
}

function getInvalidValueError(value: number, max: number): string {
  return `Progress's \`value\` prop must be a number between 0 and \`max\` (${max}) or \`null\`; received ${value}. Falling back to \`null\` (indeterminate).`;
}

function getProgressState(value: number | null, max: number): ProgressState {
  if (value == null) return 'indeterminate';
  return value === max ? 'complete' : 'loading';
}

/**
 * `role="progressbar"` — the WAI-ARIA Progress Meter pattern. Renders no
 * visual bar itself; the actual filled/empty track is `ProgressIndicator`'s
 * job (a plain `div` exposing `data-state`/`data-value`/`data-max` for
 * `react-ui` to style off of — root computes the semantics, the indicator
 * renders the visual, same split Radix's `Progress` uses).
 *
 * `value={null}` (the default) renders an indeterminate progress bar —
 * `aria-valuenow` is omitted entirely per the ARIA spec, since a determinate
 * value of `0` is a real, distinct state from "unknown/still measuring."
 *
 * @example
 * ```tsx
 * <Progress value={60}>
 *   <ProgressIndicator />
 * </Progress>
 *
 * // Indeterminate:
 * <Progress value={null}>
 *   <ProgressIndicator />
 * </Progress>
 * ```
 */
const Progress = React.forwardRef<HTMLDivElement, ScopedProps<ProgressProps>>(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp = DEFAULT_MAX,
      getValueLabel,
      children,
      ...progressProps
    } = props;

    const isValidMax = maxProp > 0;
    if (!isValidMax && process.env.NODE_ENV !== 'production') {
      console.error(getInvalidMaxError(maxProp));
    }
    const max = isValidMax ? maxProp : DEFAULT_MAX;

    const isValidValue = valueProp == null || (valueProp >= 0 && valueProp <= max);
    if (!isValidValue && process.env.NODE_ENV !== 'production') {
      console.error(getInvalidValueError(valueProp as number, max));
    }
    const value = isValidValue ? valueProp : null;

    const state = getProgressState(value, max);
    const valueLabel = value != null ? getValueLabel?.(value, max) : undefined;

    return (
      <ProgressProvider scope={__scopeProgress} value={value} max={max} state={state}>
        <Primitive
          as="div"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value ?? undefined}
          aria-valuetext={valueLabel}
          data-state={state}
          data-value={value ?? undefined}
          data-max={max}
          {...progressProps}
          ref={forwardedRef}
        >
          {children}
        </Primitive>
      </ProgressProvider>
    );
  },
);

Progress.displayName = 'Progress';

export { Progress };
export type { ProgressProps };
