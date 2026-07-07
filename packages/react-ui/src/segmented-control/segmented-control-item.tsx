import { ToggleGroupItem as HeadlessToggleGroupItem } from '@nebula/headless/toggle-group';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { ToggleGroupItemProps as HeadlessToggleGroupItemProps } from '@nebula/headless/toggle-group';

type SegmentedControlItemProps = HeadlessToggleGroupItemProps;

/** A single segment — the active one fills solid with `--color-primary` instead of `Toggle`'s subtler `--toggle-on-bg` tint, reading as a track-and-thumb control rather than a row of individually-pressed buttons. */
const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessToggleGroupItem
        className={cn(
          'inline-flex h-8 items-center justify-center gap-2 rounded-[var(--radius-selector)] px-3 text-sm font-medium text-[var(--toggle-text)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--toggle-text)] data-[state=on]:bg-[var(--color-primary)] data-[state=on]:text-[var(--color-primary-content)] data-[state=on]:shadow-sm disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

SegmentedControlItem.displayName = 'SegmentedControlItem';

export { SegmentedControlItem };
export type { SegmentedControlItemProps };
