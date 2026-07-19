
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useProgressContext } from './progress-context';

import type { ScopedProps } from './progress-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const PROGRESS_INDICATOR_NAME = 'ProgressIndicator';

type ProgressIndicatorProps = PrimitivePropsWithRef<'div'>;

/**
 * The actual filled portion of the progress bar — a plain `div` carrying
 * `data-state`/`data-value`/`data-max` (mirroring `Progress`'s own
 * attributes) for `react-ui` to size/animate off of via CSS: a percentage
 * `width` when `data-state="loading"`/`"complete"`, a looping animation when
 * `data-state="indeterminate"` (where `data-value` is absent, since there's
 * no percentage to size to). No ARIA role of its own — `Progress`'s
 * `role="progressbar"` already carries the accessible semantics; this is
 * presentation only.
 *
 * @example
 * ```tsx
 * <ProgressIndicator />
 * ```
 */
const ProgressIndicator = React.forwardRef<HTMLDivElement, ScopedProps<ProgressIndicatorProps>>(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(PROGRESS_INDICATOR_NAME, __scopeProgress);

    return (
      <Primitive
        as="div"
        data-state={context.state}
        data-value={context.value ?? undefined}
        data-max={context.max}
        {...indicatorProps}
        ref={forwardedRef}
      />
    );
  },
);

ProgressIndicator.displayName = PROGRESS_INDICATOR_NAME;

export { ProgressIndicator };
export type { ProgressIndicatorProps };
