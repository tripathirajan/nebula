import { ToggleGroup as HeadlessToggleGroup } from '@nebula/headless/toggle-group';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { ToggleGroupSingleProps as HeadlessToggleGroupSingleProps } from '@nebula/headless/toggle-group';

/** Props accepted by {@link SegmentedControl} — always single-select; there's no `type` prop to set. */
type SegmentedControlProps = Omit<HeadlessToggleGroupSingleProps, 'type'>;

/**
 * A single-select visual variant of `ToggleGroup` — same headless behavior
 * (`@nebula/headless`'s `ToggleGroup` with `type="single"` fixed, since a
 * segmented control by definition allows exactly one active segment), just
 * a continuous filled-track look instead of `ToggleGroup`'s individually
 * bordered, gapped buttons. Built directly on `@nebula/headless` rather
 * than through an intermediate `@nebula/styleless` shell — same call
 * `react-ui`'s own `Toggle` already makes, since there's no structural
 * behavior here beyond what `ToggleGroup` already provides, only a
 * different visual treatment of it (see `LAYER_TAXONOMY.md` §4's
 * Selection note).
 *
 * @example
 * ```tsx
 * <SegmentedControl defaultValue="list" aria-label="View">
 *   <SegmentedControlItem value="list">List</SegmentedControlItem>
 *   <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
 * </SegmentedControl>
 * ```
 */
const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessToggleGroup
        type="single"
        className={cn(
          'inline-flex gap-0.5 rounded-[var(--radius-field)] bg-[var(--toggle-group-border)]/40 p-1 data-[orientation=vertical]:flex-col',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

SegmentedControl.displayName = 'SegmentedControl';

export { SegmentedControl };
export type { SegmentedControlProps };
