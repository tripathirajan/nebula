import { ToggleGroup as HeadlessToggleGroup } from '@nebula/headless/toggle-group';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { ToggleGroupProps as HeadlessToggleGroupProps } from '@nebula/headless/toggle-group';

type ToggleGroupProps = HeadlessToggleGroupProps;

/** `data-orientation` (set by the headless source) switches the row between horizontal and vertical layout. */
const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessToggleGroup
      className={cn(
        'inline-flex gap-1 rounded-[var(--radius-field)] border border-[var(--toggle-group-border)] p-1 data-[orientation=vertical]:flex-col',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

ToggleGroup.displayName = 'ToggleGroup';

export { ToggleGroup };
export type { ToggleGroupProps };
