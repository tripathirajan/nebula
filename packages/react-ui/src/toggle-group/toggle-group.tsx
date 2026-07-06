import { cn } from '@nebula/primitives/cn';
import { ToggleGroup as StylelessToggleGroup } from '@nebula/styleless/toggle-group';
import * as React from 'react';

import type { ToggleGroupProps as StylelessToggleGroupProps } from '@nebula/styleless/toggle-group';

type ToggleGroupProps = StylelessToggleGroupProps;

/** `data-orientation` (set by the styleless source) switches the row between horizontal and vertical layout. */
const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessToggleGroup
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
